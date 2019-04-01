<template>
  <div class="jumbotron mt-5">
    <h1 class="display-4">Hello, world!</h1>
    <p class="lead">
      Welcome to <code>ts-git</code>. This project is currently under
      construction.
    </p>
    <hr class="my-4" />
    <p>
      In the meantime, check out the source on
      <a href="https://gitlab.com/nfriend/ts-git">GitLab</a>.
    </p>
    <a
      class="btn btn-primary btn-lg"
      href="https://gitlab.com/nfriend/ts-git"
      role="button"
      >View source</a
    >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class UnderConstruction extends Vue {}
</script>
