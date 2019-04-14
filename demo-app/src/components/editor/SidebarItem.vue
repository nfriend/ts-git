<template>
  <div
    class="sidebar-item-container d-flex align-items-center"
    @click="isOpen = !isOpen"
  >
    <font-awesome-icon
      class="item-icon"
      :class="{ angled: isOpen }"
      v-if="isFolder"
      icon="caret-right"
    />
    <font-awesome-icon class="item-icon" v-if="isFile" icon="align-left" />
    <span>{{ name }}</span>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-item-container {
  color: #ccc;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background: #2b2d2e;
  }

  .item-icon {
    width: 25px;
    font-size: 0.8em;
    transition: transform 0.15s ease-in-out;
  }

  .angled {
    transform: rotate(45deg);
  }
}
</style>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  props: {
    isFolder: {
      type: Boolean,
    },
    isOpen: {
      type: Boolean,
    },
    name: {
      type: String,
    },
  },
  computed: {
    isFile() {
      return !this.isFolder;
    },
  },
})
export default class SidebarItem extends Vue {}
</script>
