<template>
  <div class="d-flex flex-column h-100">
    <Header />
    <div class="d-flex flex-grow-1">
      <WindowChrome class="flex-even ml-3 mr-3 mb-3">
        <Terminal />
      </WindowChrome>
      <WindowChrome class="flex-even ml-0 mr-3 mb-3">
        <div>File editor will go here</div>
      </WindowChrome>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import Terminal from '@/components/Terminal.vue';
import Header from '@/components/Header.vue';
import WindowChrome from '@/components/WindowChrome.vue';

@Component({
  components: {
    Terminal,
    Header,
    WindowChrome,
  },
})
export default class Home extends Vue {}
</script>
