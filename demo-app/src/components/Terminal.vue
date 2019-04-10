<template>
  <div class="terminal-container d-flex flex-column">
    <div class="flex-grow-1"></div>
    <input
      type="text"
      autofocus
      autocomplete="off"
      spellcheck="off"
      value="░"
    />
  </div>
</template>

<style lang="scss" scoped>
.terminal-container {
  height: 500px;
  background: #1e1e1e;
  font-family: monospace;

  input {
    background: none;
    border: none;
    outline: none;
    color: white;
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Terminal extends Vue {}
</script>
