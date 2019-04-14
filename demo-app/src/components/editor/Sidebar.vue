<template>
  <div class="editor-container">
    <SidebarItem name="folder-1" :isFolder="true" :isOpen="true" />
    <SidebarItem name="folder-2" :isFolder="true" :isOpen="false" />
    <SidebarItem name="file-1" :isFolder="false" :isOpen="true" />
  </div>
</template>

<style lang="scss" scoped>
.editor-container {
  background: #252526;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SidebarItem from './SidebarItem.vue';

@Component({
  components: {
    SidebarItem,
  },
})
export default class Sidebar extends Vue {}
</script>
