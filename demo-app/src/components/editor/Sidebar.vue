<template>
  <div class="editor-container">
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
.editor-container {
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
  }
}
</script>
