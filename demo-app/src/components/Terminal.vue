<template>
  <div class="flex-grow-1 h-100 terminal-container">
    <p class="m-3 ml-5 mr-5 text-white text-monospace text-center">
      <b>Welcome to ts-git!</b><br /><br />
      Give ts-git a spin by editing files
      <span class="d-none d-md-inline">on the right</span>
      <span class="d-inline d-md-none">in the window below</span>
      and running some git commands here
      <br /><br />
      <b>Note:</b> ts-git is under construction. In the meantime, check out the
      source at
      <a href="https://gitlab.com/nfriend/ts-git" target="_blank">
        https://gitlab.com/nfriend/ts-git
      </a>
    </p>
    <VueCommand
      :commands="commands"
      :hide-bar="true"
      help-text='Try "ts-git --help"'
      :show-help="true"
      prompt="$"
      class="flex-even"
    />
  </div>
</template>

<style lang="scss">
.terminal-container {
  * {
    font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
      'Courier New', monospace !important;
    font-size: 14px !important;
  }

  .vue-command {
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

  .output {
    white-space: pre;
  }

  .error-output {
    color: #f1625c;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueCommand from 'vue-command';
import 'vue-command/dist/vue-command.css';
import { TsGit } from '@nathanfriend/ts-git';
import escape from 'lodash/escape';

@Component({
  components: {
    VueCommand,
  },
})
export default class Terminal extends Vue {
  private tsGit!: TsGit;

  beforeCreate() {
    this.tsGit = new TsGit('LocalStorage');
  }

  commands = {
    'ts-git': async argv => {
      let result = await this.tsGit.processArgv(argv);

      if (result.message) {
        // sanitize the message for HTML usage
        result.message = escape(result.message);

        result.message = `<span class="output">${result.message}</span>`;
      }

      if (result.success) {
        if (result.message) {
          return result.message;
        }
      } else {
        if (result.message) {
          return `<span class="error-output">${result.message}</span>`;
        } else {
          return `<span class="error-output ">An unexpected error occurred :(</span>`;
        }
      }
    },
    help: () => {
      return 'Try "ts-git --help"';
    },
    async: async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve('This was an async command!');
        }, 1500);
      });
    },
  };
}
</script>
