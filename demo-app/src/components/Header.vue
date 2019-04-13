<template>
  <div
    class="d-flex justify-content-center p-sm-5 flex-column flex-sm-row align-items-center mt-5 mb-5 m-sm-0"
  >
    <img
      id="ts-git-logo"
      src="../assets/ts-git.png"
      width="200"
      height="200"
      class="mb-3 mb-sm-0"
    />
    <div class="d-flex flex-column ml-4 mr-4 text-center text-sm-left">
      <h1 class="display-4">ts-git</h1>
      <p class="lead">
        A naïve implementation of
        <a href="https://git-scm.com/" target="_blank">git</a>, written in
        <a href="https://www.typescriptlang.org/" target="_blank">TypeScript</a
        >.
      </p>
      <p class="text-secondary">
        Source:
        <a href="https://gitlab.com/nfriend/ts-git" target="_blank">
          https://gitlab.com/nfriend/ts-git
        </a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#ts-git-logo {
  border-radius: 6px;
}
</style>
