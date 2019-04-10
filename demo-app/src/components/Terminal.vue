<template>
  <VueTerminal
    :task-list="taskList"
    :command-list="commandList"
    :show-header="false"
    :show-initial-cd="false"
    :show-help-message="false"
    :unknown-command-message="unknownCommandMessage"
    default-task="greet"
    greeting="Welcome to ts-git!"
    prompt=">"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueTerminal from '@nathanfriend/vue-terminal';

@Component({
  components: {
    VueTerminal,
  },
})
export default class Terminal extends Vue {
  taskList = {
    greet: {
      description: 'Writes a greeting to the console',
      async greet(pushToList) {
        return await {
          message: 'To see a list of available commands, run "ts-git --help"',
        };
      },
    },
    'ts-git': {
      description: 'Runs ts-git',
      'ts-git': async (pushToList, input) => {
        return await {
          message: `You ran "${input}"`,
        };
      },
    },
  };
  commandList = {};
  unknownCommandMessage = {
    label: 'error',
    type: 'error',
    message: 'Unknown command. Try ts-git --help',
  };
}
</script>
