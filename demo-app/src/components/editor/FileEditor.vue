<template>
  <MonacoEditor
    class="flex-grow-1 h-100"
    v-model="code"
    :options="options"
    theme="vs-dark"
    language="javascript"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MonacoEditor from 'vue-monaco';

@Component({
  components: {
    MonacoEditor,
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
    fontSize: '16px',
  };
}
</script>
