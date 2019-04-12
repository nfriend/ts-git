<template>
  <div class="flex-grow-1 h-100">
    <p class="m-3 ml-5 mr-5 text-white text-monospace text-center">
      <b>Welcome to ts-git!</b><br /><br />
      Give ts-git a spin by editing files on the right and running some git
      commands here
    </p>
    <VueCommand
      :commands="commands"
      :hide-bar="true"
      help-text='Try "ts-git --help"'
      :show-help="true"
      prompt=">"
      class="flex-even"
    />
  </div>
</template>

<style lang="scss">
.vue-command {
  * {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace !important;
  }

  .term {
    width: 100%;
    height: 100%;
    background: #1e1e1e;
    border: none;

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
import { setTimeout } from 'timers';

@Component({
  components: {
    VueCommand,
  },
})
export default class Terminal extends Vue {
  commands = {
    'ts-git': ({ _ }) => {
      return `You typed: "${_.join(' ')}"`;

      // return new Promise(resolve => {
      //   setTimeout(() => {
      //     resolve(`You typed: "${_.join(' ')}"`);
      //   }, 2000);
      // });
    },
  };
}

const data = () => ({
  commands: {
    pokedex: ({ _ }) => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(`You typed: "${_.join(' ')}"`);
        }, 2000);
      });
    },
  },
});
</script>
