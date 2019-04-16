<template>
  <div>
    <div
      class="sidebar-item-container d-flex align-items-center"
      :class="{ selected: isSelected }"
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
      <span class="flex-grow-1">{{ item.name }}</span>
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

  &:hover {
    background: #2b2d2e;

    .delete-icon {
      visibility: visible;
    }
  }

  &.selected {
    background: #0b4770;
    color: #fff;
  }

  .item-icon {
    width: 25px;
    font-size: 0.8em;
    transition: transform 0.15s ease-in-out;
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
import { Component, Vue, Prop } from 'vue-property-decorator';

export interface FileSystemItem {
  name: string;
  path: string;
  isFolder: boolean;
  isFolderOpen: boolean;
  children: FileSystemItem[];
}

@Component
export default class SidebarItem extends Vue {
  @Prop({ type: Object, required: true }) readonly item!: FileSystemItem;
  @Prop({ type: String, required: true }) readonly selectedPath!: string;
  @Prop({ type: Number, required: false, default: 0 }) readonly indent!: number;

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
}
</script>
