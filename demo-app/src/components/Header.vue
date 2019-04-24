<template>
  <div
    class="d-flex justify-content-center p-sm-5 flex-column flex-sm-row align-items-center mt-5 mb-5 m-sm-0"
  >
    <MobileWarning class="d-sm-none" />
    <img
      id="ts-git-logo"
      src="../assets/ts-git.png"
      width="200"
      height="200"
      class="mb-3 mb-sm-0"
    />
    <div class="d-flex flex-column ml-4 mr-4 text-center text-sm-left">
      <h1 class="display-4">ts-git</h1>
      <p class="lead">
        A naïve implementation of
        <a href="https://git-scm.com/" target="_blank">git</a>, written in
        <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a
        >.
      </p>
      <p class="text-secondary">
        Source:
        <a
          href="https://gitlab.com/nfriend/ts-git"
          target="_blank"
          class="mr-1"
        >
          https://gitlab.com/nfriend/ts-git
        </a>
        <a href="https://gitlab.com/nfriend/ts-git/pipelines" target="_blank">
          <img
            src="https://gitlab.com/nfriend/ts-git/badges/master/pipeline.svg"
            alt="GitLab build status"
          />
        </a>
      </p>
    </div>

    <GitLabCorner />
  </div>
</template>

<style lang="scss" scoped>
#ts-git-logo {
  border-radius: 6px;
}
</style>

<script lang="ts">
import { Component } from 'vue-property-decorator';
import GitLabCorner from './GitLabCorner.vue';
import MobileWarning from './MobileWarning.vue';
import Vue from 'vue';

@Component({
  components: {
    GitLabCorner,
    MobileWarning,
  },
})
export default class Header extends Vue {}
</script>
