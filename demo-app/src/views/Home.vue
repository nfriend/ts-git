<template>
  <div class="d-flex flex-column h-100">
    <Header class="flex-shrink-0" />
    <div class="d-flex flex-column flex-md-row flex-grow-1 min-height-0">
      <WindowChrome class="flex-even ml-3 mr-3 mb-3" :scrollable="true">
        <Terminal @fileSystemChanged="updateFileSystem" />
      </WindowChrome>
      <WindowChrome class="flex-even ml-3 ml-md-0 mr-3 mb-3">
        <FileEditor ref="FileEditor" />
      </WindowChrome>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Terminal from '@/components/Terminal.vue';
import FileEditor from '@/components/editor/FileEditor.vue';
import Header from '@/components/Header.vue';
import WindowChrome from '@/components/WindowChrome.vue';

@Component({
  components: {
    Terminal,
    FileEditor,
    Header,
    WindowChrome,
  },
})
export default class Home extends Vue {
  updateFileSystem() {
    this.$refs.FileEditor.updateFileSystem();
  }
}
</script>
