<template>
  <VueTerminal
    :task-list="taskList"
    :command-list="commandList"
    :title="'test'"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueTerminal from 'vue-terminal';

@Component({
  components: {
    VueTerminal,
  },
})
export default class Terminal extends Vue {
  taskList = {
    defaultTask: {
      description: 'this is default task.',
      async defaultTask(pushToList) {
        return await {
          type: 'success',
          label: 'Success',
          message: 'Hello, world!',
        };
      },
    },
  };
  commandList = {
    // your commands
  };
}
</script>
