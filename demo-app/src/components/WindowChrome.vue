<template>
  <div class="window d-flex flex-column">
    <div class="titlebar flex-shrink-0">
      {{ title }}
    </div>
    <div
      class="content d-flex d-flex-column flex-grow-1"
      :class="{ scrollable: scrollable }"
    >
      <slot class="flex-grow-1"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.window {
  border: 1px solid #acacac;
  border-radius: 6px;
  box-shadow: 0px 0px 20px #acacac;
  overflow: hidden;
  background: #1e1e1e;
}

.titlebar {
  background: linear-gradient(to bottom, #434346, #363739);
  color: #b8b8bb;
  font-size: 10pt;
  line-height: 15px;
  text-align: center;
  height: 20px;
  border-top: 1px solid #6b6c6e;
  border-bottom: 1px solid #5c5c5d;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  cursor: default;
}

.content {
  &.scrollable {
    overflow-y: scroll;
  }
}
</style>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class WindowChrome extends Vue {
  @Prop({ type: String, required: false, default: '' }) readonly title!: string;
  @Prop({ type: Boolean, required: false, default: false })
  readonly scrollable!: boolean;
}
</script>
