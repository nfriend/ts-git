<template>
  <VueCommand
    :commands="commands"
    :hide-bar="true"
    help-text='Try "ts-git --help"'
    :show-help="true"
    prompt=">"
    class="flex-even"
  />
</template>

<style lang="scss">
.vue-command {
  .term {
    width: 100%;

    .term-std {
      min-height: 100%;
      max-height: 100%;
      overflow-y: scroll;
    }
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueCommand from 'vue-command';
import 'vue-command/dist/vue-command.css';

@Component({
  components: {
    VueCommand,
  },
})
export default class Terminal extends Vue {
  commands = {
    'ts-git': ({ _ }) => {
      return `You typed: "${_.join(' ')}"`;
    },
  };
}
</script>
