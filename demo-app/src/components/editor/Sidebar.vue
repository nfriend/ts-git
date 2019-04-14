<template>
  <div class="editor-container">
    <SidebarItem v-for="item in items" :item="item" />
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
  items: FileSystemItem[] = [
    {
      name: 'folder-1',
      isFolder: true,
      isFolderOpen: true,
      isSelected: false,
      children: [
        {
          name: 'nested-folder-1',
          isFolder: true,
          isFolderOpen: true,
          isSelected: false,
          children: [
            {
              name: 'file-1',
              isFolder: false,
              isFolderOpen: false,
              isSelected: false,
              children: [],
            },
            {
              name: 'file-2',
              isFolder: false,
              isFolderOpen: false,
              isSelected: false,
              children: [],
            },
          ],
        },
      ],
    },
    {
      name: 'folder-2',
      isFolder: true,
      isFolderOpen: true,
      isSelected: false,
      children: [],
    },
    {
      name: 'file-1',
      isFolder: false,
      isFolderOpen: false,
      isSelected: false,
      children: [],
    },
  ];
}
</script>
