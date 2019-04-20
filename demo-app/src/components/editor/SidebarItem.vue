<template>
  <div>
    <div
      class="sidebar-item-container d-flex align-items-center"
      :class="{ selected: isSelected, editing: isEditing }"
      :style="indentStyle"
      @click="clicked"
    >
      <font-awesome-icon
        class="item-icon"
        :class="{ angled: item.isFolderOpen }"
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
    <div class="children-container" v-if="item.isFolderOpen">
      <SidebarItem
        v-for="item in item.children"
        :key="item.path"
        :item="item"
        :indent="indent + 1"
        :selectedPath="selectedPath"
        @itemSelected="itemSelected"
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
import { Component, Vue, Prop } from 'vue-property-decorator';
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
    required: true,
  })
  readonly selectedPath!: string;

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  readonly indent!: number;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  readonly isNew!: number;

  mounted() {
    if (this.isNew) {
      this.isEditing = true;
    }
  }

  isEditing: boolean = false;
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

  clicked() {
    this.item.isFolderOpen = !this.item.isFolderOpen;
    this.$emit('itemSelected', this.item);
  }

  deleteClicked() {
    this.$emit('itemDeleted', this.item);
  }

  itemSelected(item) {
    this.$emit('itemSelected', item);
  }

  onNameEnterDown() {
    this.proposedName = this.item.name;
    this.isEditing = true;

    Vue.nextTick().then(() => {
      const editInput = <HTMLInputElement>this.$refs.editInput;
      editInput.select();
      editInput.focus();
    });
  }

  onInputEnterDown() {
    this.isEditing = false;
  }

  onInputEscDown() {
    this.cancelEdit = true;
    this.isEditing = false;
  }

  onEditInputBlur() {
    if (this.cancelEdit) {
      this.cancelEdit = true;
    } else {
      this.renameItem();
    }
    this.isEditing = false;
  }

  private async renameItem() {
    const oldPath = this.item.path;
    const newPath = path.join(oldPath, '../', this.proposedName);
    await FileSystemService.renameFileOrFolder(oldPath, newPath);
    this.item.name = this.proposedName;
    this.item.path = newPath;
  }
}
</script>
