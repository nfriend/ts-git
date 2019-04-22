<template>
  <div class="sidebar-container">
    <div
      class="sidebar-controls d-flex flex-row-reverse align-items-stretch p-1 mb-2"
    >
      <span
        class="control d-flex align-items-center justify-content-center"
        v-b-tooltip.d350
        title="Add a new folder"
        @click="newFolderClicked"
      >
        <font-awesome-icon icon="folder-plus" />
      </span>

      <span
        class="control d-flex align-items-center justify-content-center"
        v-b-tooltip.d500
        title="Add a new file"
        @click="newFileClicked"
      >
        <font-awesome-icon icon="file-medical" />
      </span>
    </div>
    <SidebarItem
      v-for="item in filesAndFolders"
      :key="item.path"
      :item="item"
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
</template>

<style lang="scss" scoped>
.sidebar-container {
  font-size: 14px;

  .sidebar-controls {
    color: #ccc;
    background: #37373d;

    .control {
      width: 25px;
      cursor: pointer;

      &:hover {
        color: white;
      }
    }
  }
  background: #252526;
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import SidebarItem from './SidebarItem.vue';
import { FileSystemItem } from '../../services/FileSystem.service';

@Component({
  components: {
    SidebarItem,
  },
})
export default class Sidebar extends Vue {
  @Prop({
    type: Array,
    required: true,
  })
  readonly filesAndFolders!: FileSystemItem[];

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

  newFolderClicked() {
    this.$emit('newFolder');
  }

  newFileClicked() {
    this.$emit('newFile');
  }
}
</script>
