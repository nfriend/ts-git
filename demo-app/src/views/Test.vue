<template>
  <div class="container">
    <Terminal />
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
export default class Test extends Vue {}
</script>
