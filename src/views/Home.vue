<template>
  <div class="container">
    <UnderConstruction />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import UnderConstruction from '@/components/UnderConstruction.vue';

@Component({
  components: {
    UnderConstruction,
  },
})
export default class Home extends Vue {}
</script>
