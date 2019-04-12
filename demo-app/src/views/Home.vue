<template>
  <div class="d-flex h-100">
    <Terminal class="flex-even d-flex" />
    <div class="flex-even">Hello world!</div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Terminal from '@/components/Terminal.vue';

@Component({
  components: {
    Terminal,
  },
})
export default class Home extends Vue {}
</script>
