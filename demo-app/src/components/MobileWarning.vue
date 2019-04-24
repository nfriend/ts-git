<template>
  <b-alert variant="dark" show>
    <b>Heads up!</b>
    This project works best on large screens.
  </b-alert>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class MobileWarning extends Vue {}
</script>
