<template>
  <div>
    <div
      class="sidebar-item-container d-flex align-items-center"
      :class="{
        selected: isSelected,
        editing: isEditing,
        'has-error': proposedNameIsDuplicate,
      }"
      :style="indentStyle"
      @click="clicked"
    >
      <font-awesome-icon
        class="item-icon"
        :class="{ angled: isFolderOpen }"
        v-if="item.isFolder"
        icon="caret-right"
      />
      <font-awesome-icon
        class="item-icon"
        v-if="!item.isFolder"
        icon="align-left"
      />
      <span
        v-if="!isEditing"
        ref="nameSpan"
        class="item-name flex-grow-1"
        @keydown.enter="onNameEnterDown"
        tabindex="0"
        >{{ item.name }}</span
      >
      <input
        v-if="isEditing"
        ref="editInput"
        class="d-flex flex-grow-1 edit-item-name-input p-0"
        style="min-width: 0"
        v-model="proposedName"
        @blur="onEditInputBlur"
        @keydown.enter="onInputEnterDown"
        @keydown.esc="onInputEscDown"
      />
      <span
        @click.stop="deleteClicked"
        v-b-tooltip.d500
        :title="'Delete ' + item.name"
        class="align-self-stretch d-flex align-items-center"
      >
        <font-awesome-icon class="item-icon delete-icon" icon="trash" />
      </span>
    </div>
    <div class="children-container" v-if="isFolderOpen">
      <SidebarItem
        v-for="item in item.children"
        :key="item.path"
        :item="item"
        :indent="indent + 1"
        :selectedPath="selectedPath"
        :pathBeingEdited="pathBeingEdited"
        :collapsedPaths="collapsedPaths"
        @pathSelected="pathSelected"
        @pathEditing="pathEditing"
        @pathRenamed="pathRenamed"
        @pathDeleted="pathDeleted"
        @folderToggled="folderToggled"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-item-container {
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
  user-select: none;

  &:hover,
  &:focus-within {
    background: #2b2d2e;

    .delete-icon {
      visibility: visible;
    }
  }

  &.has-error {
    background: #591d1e !important;
  }

  &.selected {
    background: #0b4770;
    color: #fff;
  }

  &.editing {
    background: #2b2d2e;
  }

  .item-icon {
    width: 25px;
    font-size: 0.8em;
    transition: transform 0.15s ease-in-out;
  }

  .item-name {
    outline: none;
  }

  .edit-item-name-input {
    background: none;
    color: white;
    border: none;
    outline: none;
  }

  .delete-icon {
    visibility: hidden;
  }

  .angled {
    transform: rotate(45deg);
  }
}
</style>

<script lang="ts">
import * as path from 'path';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  FileSystemItem,
  FileSystemService,
} from '../../services/FileSystem.service';

@Component({ name: 'SidebarItem' })
export default class SidebarItem extends Vue {
  @Prop({
    type: Object,
    required: true,
  })
  readonly item!: FileSystemItem;

  @Prop({
    type: String,
    required: false,
    default: undefined,
  })
  readonly selectedPath!: string;

  @Prop({
    type: String,
    required: false,
    default: undefined,
  })
  readonly pathBeingEdited!: string;

  @Prop({
    type: Array,
    required: true,
  })
  readonly collapsedPaths!: string[];

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  readonly indent!: number;

  mounted() {
    this.proposedName = this.item.name;

    if (this.isEditing) {
      this.focusInputOnNextTick();
    }
  }

  proposedName: string = '';

  private cancelEdit = false;

  get indentStyle() {
    return {
      'padding-left': this.indent * 20 + 10 + 'px',
    };
  }

  get isSelected() {
    return this.selectedPath === this.item.path;
  }

  get isEditing() {
    return this.pathBeingEdited === this.item.path;
  }

  get proposedNameIsDuplicate() {
    return this.item.siblingNames.includes(this.proposedName);
  }

  get isFolderOpen() {
    return this.item.isFolder && !this.collapsedPaths.includes(this.item.path);
  }

  clicked() {
    this.$emit('pathSelected', this.item.path);
    if (this.item.isFolder) {
      this.$emit('folderToggled', this.item.path);
    }
  }

  deleteClicked() {
    this.$emit('pathDeleted', this.item.path);
  }

  pathSelected(path: string) {
    this.$emit('pathSelected', path);
  }

  pathEditing(path: string) {
    this.$emit('pathEditing', path);
  }

  pathRenamed(...args) {
    this.$emit('pathRenamed', ...args);
  }

  pathDeleted(path: string) {
    this.$emit('pathDeleted', path);
  }

  folderToggled(path: string) {
    this.$emit('folderToggled', path);
  }

  onNameEnterDown() {
    this.proposedName = this.item.name;
    this.$emit('pathEditing', this.item.path);
    this.focusInputOnNextTick();
  }

  onInputEnterDown() {
    this.$emit('pathEditing', null);
  }

  onInputEscDown() {
    this.cancelEdit = true;
    this.$emit('pathEditing', null);
  }

  onEditInputBlur() {
    if (this.cancelEdit || this.proposedNameIsDuplicate) {
      this.cancelEdit = true;
      this.proposedName = this.item.name;
    } else {
      this.renameItem();
    }
    this.$emit('pathEditing', null);
  }

  private async renameItem() {
    const oldPath = this.item.path;
    const newPath = path.join(oldPath, '../', this.proposedName);
    this.$emit('pathRenamed', oldPath, newPath);
  }

  private focusInputOnNextTick() {
    Vue.nextTick().then(() => {
      const editInput = <HTMLInputElement>this.$refs.editInput;
      editInput.select();
      editInput.focus();
    });
  }
}
</script>
