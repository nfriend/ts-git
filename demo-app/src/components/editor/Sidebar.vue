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
      v-for="item in items"
      :key="item.path"
      :item="item"
      :selectedPath="selectedPath"
      @itemSelected="itemSelected"
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
import { Component, Vue } from 'vue-property-decorator';
import SidebarItem, { FileSystemItem } from './SidebarItem.vue';

@Component({
  components: {
    SidebarItem,
  },
})
export default class Sidebar extends Vue {
  selectedPath: string = '/';

  items: FileSystemItem[] = [
    {
      name: 'folder-1',
      path: '/folder-1',
      isFolder: true,
      isFolderOpen: true,
      children: [
        {
          name: 'nested-folder-1',
          path: '/folder-1/nested-folder-1',
          isFolder: true,
          isFolderOpen: true,
          children: [
            {
              name: 'file-1',
              path: '/folder-1/nested-folder-1/file-1',
              isFolder: false,
              isFolderOpen: false,
              children: [],
            },
            {
              name: 'file-2',
              path: '/folder-1/nested-folder-1/file-2',
              isFolder: false,
              isFolderOpen: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'folder-2',
      path: '/folder-2',
      isFolder: true,
      isFolderOpen: true,
      children: [],
    },
    {
      name: 'file-1',
      path: '/file-1',
      isFolder: false,
      isFolderOpen: false,
      children: [],
    },
  ];

  itemSelected(item) {
    this.selectedPath = item.path;
    this.$emit('itemSelected', this.selectedPath);
  }

  newFolderClicked() {
    this.$emit('newFolder');
  }

  newFileClicked() {
    this.$emit('newFile');
  }
}
</script>
