<template>
  <div id="app" class="h-100">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  background-color: #e9ecef;
}

// https://stackoverflow.com/a/51775832/1063392
.flex-even {
  flex: 1;
}

.min-height-0 {
  min-height: 0;
}
</style>
