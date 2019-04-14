<template>
  <div class="flex-grow-1 d-flex">
    <Sidebar class="flex-shrink-0 editor-sidebar" />
    <MonacoEditor
      class="flex-grow-1"
      v-model="code"
      :options="options"
      theme="vs-dark"
      language="javascript"
    />
  </div>
</template>

<style lang="scss" scoped>
.editor-sidebar {
  width: 200px;
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MonacoEditor from 'vue-monaco';
import Sidebar from './Sidebar.vue';

@Component({
  components: {
    MonacoEditor,
    Sidebar,
  },
})
export default class FileEditor extends Vue {
  code = [
    "// This editor isn't functional yet!",
    '// Until it is, check out the source at',
    '// https://gitlab.com/nfriend/ts-git',
    '',
    "console.log('Hello, world!');",
  ].join('\n');

  options = {
    fontSize: '14px',
    automaticLayout: true,
  };
}
</script>
