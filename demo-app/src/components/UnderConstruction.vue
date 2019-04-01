<template>
  <b-jumbotron
    class="mt-5"
    header="ts-git"
    lead="git, implemented in TypeScript"
  >
    <p>
      This project is currently under construction. In the meantime, check out
      the source on <a href="https://gitlab.com/nfriend/ts-git">GitLab</a>.
    </p>
    <b-button variant="primary" href="https://gitlab.com/nfriend/ts-git"
      >View source</b-button
    >
  </b-jumbotron>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class UnderConstruction extends Vue {}
</script>
