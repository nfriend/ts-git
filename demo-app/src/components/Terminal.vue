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
    white-space: pre-wrap;

    &.error-output {
      color: #f1625c;
    }
  }
}
</style>

<script lang="ts">
import * as path from 'path';
import { Component, Vue } from 'vue-property-decorator';
import VueCommand from 'vue-command';
import escape from 'lodash/escape';
import { TsGit } from '@nathanfriend/ts-git';
import 'vue-command/dist/vue-command.css';
import { LocalStorageInitializationService } from '../services/LocalStorageInitialization.service';

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

  emitEvent() {
    this.$emit('fileSystemChanged');
  }

  commands = {
    'ts-git': async argv => {
      let result = await this.tsGit.processArgv(argv);

      this.emitEvent();

      if (result.success) {
        if (result.message) {
          return this.wrapOutput(result.message);
        }
      } else {
        if (result.message) {
          return this.wrapOutput(result.message, true);
        } else {
          return this.wrapOutput('An unexpected error occurred :(', true);
        }
      }
    },
    reset: async () => {
      localStorage.clear();
      this.tsGit = new TsGit('LocalStorage');

      await LocalStorageInitializationService.initializeDemoFileSystem(true);

      this.emitEvent();

      return this.wrapOutput(
        'Successfully reset the filesystem. The demo filesystem has been restored.',
      );
    },
    clear: async () => {
      localStorage.clear();
      this.tsGit = new TsGit('LocalStorage');

      this.emitEvent();

      return this.wrapOutput(
        'Successfully cleared the filesystem. All files and folders have been deleted.',
      );
    },
    git: () => {
      return this.wrapOutput(`Did you mean "ts-git"? :)`);
    },
    help: () => {
      return this.wrapOutput(
        [
          `To get help on how to use ts-git, run "ts-git --help"`,
          ``,
          `To do a "factory reset" on the filesystem and restore the demo filesystem, run "reset"`,
          ``,
          `To clear the filesystem completely, run "clear"`,
        ].join('\n'),
      );
    },
    gitlab: () => {
      return this.wrapOutput(`
           '                        '
          :s:                      :s:
         'oso'                    'oso.
         +sss+                    +sss+
        :sssss:                  -sssss:
       'ossssso'                'ossssso'
       +sssssss+                +sssssss+
      -ooooooooo-++++++++++++++-ooooooooo-
     ':/+++++++++osssssssssssso+++++++++/:'
     -///+++++++++ssssssssssss+++++++++///-
    .//////+++++++osssssssssso+++++++//////.
    :///////+++++++osssssssso+++++++///////:
     .:///////++++++ssssssss++++++///////:.'
       '-://///+++++osssssso+++++/////:-'
          '-:////++++osssso++++////:-'
             .-:///++osssso++///:-.
               '.://++osso++//:.'
                  '-:/+oo+/:-'
                     '-++-'
`);
    },
  };

  private wrapOutput(output: string, isError = false) {
    output = escape(output);
    return `<span class="output ${
      isError ? 'error-output' : ''
    }">${output}</span>`;
  }
}
</script>
