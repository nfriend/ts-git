<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
#app {
  background-color: #e9ecef;
  height: 200%;
}

// https://stackoverflow.com/a/51775832/1063392
.flex-even {
  flex: 1;
}

.min-height-0 {
  min-height: 0;
}

// TODO: use Bootstrap's breabkpoint mixin
// here instead of hardcoding the px
@media (min-width: 768px) {
  html,
  body {
    overflow: hidden;
  }

  #app {
    height: 100%;
  }
}
</style>
