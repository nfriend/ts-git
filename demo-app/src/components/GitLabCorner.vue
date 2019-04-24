<template>
  <div class="gitlab-corner-wrapper">
    <a
      href="https://gitlab.com/nfriend/ts-git"
      class="gitlab-corner"
      aria-label="View source on GitLab"
      ><svg
        id="logo_art"
        data-name="logo art"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 586 559"
      >
        <g id="g44">
          <path
            id="path46"
            class="cls-g-1"
            d="M461.17,301.83l-18.91-58.12L404.84,128.43a6.47,6.47,0,0,0-12.27,0L355.15,243.64H230.82L193.4,128.43a6.46,6.46,0,0,0-12.26,0L143.78,243.64l-18.91,58.19a12.88,12.88,0,0,0,4.66,14.39L293,435,456.44,316.22a12.9,12.9,0,0,0,4.73-14.39"
          />
        </g>
        <g id="g48">
          <path
            id="path50"
            class="cls-g-2"
            d="M293,434.91h0l62.16-191.28H230.87L293,434.91Z"
          />
        </g>
        <g id="g56">
          <path
            id="path58"
            class="cls-g-1"
            d="M293,434.91,230.82,243.63h-87L293,434.91Z"
          />
        </g>
        <g id="g64">
          <path
            id="path66"
            class="cls-g-3"
            d="M143.75,243.69h0l-18.91,58.12a12.88,12.88,0,0,0,4.66,14.39L293,435,143.75,243.69Z"
          />
        </g>
        <g id="g72">
          <path
            id="path74"
            class="cls-g-2"
            d="M143.78,243.69h87.11L193.4,128.49a6.47,6.47,0,0,0-12.27,0l-37.35,115.2Z"
          />
        </g>
        <g id="g76">
          <path
            id="path78"
            class="cls-g-1"
            d="M293,434.91l62.16-191.28H442.3L293,434.91Z"
          />
        </g>
        <g id="g80">
          <path
            id="path82"
            class="cls-g-3"
            d="M442.24,243.69h0l18.91,58.12a12.85,12.85,0,0,1-4.66,14.39L293,434.91l149.2-191.22Z"
          />
        </g>
        <g id="g84">
          <path
            id="path86"
            class="cls-g-2"
            d="M442.28,243.69h-87.1l37.42-115.2a6.46,6.46,0,0,1,12.26,0l37.42,115.2Z"
          />
        </g></svg
    ></a>
  </div>
</template>

<style>
.gitlab-corner-wrapper {
  overflow: hidden;
  width: 100px;
  height: 100px;
  position: absolute;
  top: 0;
  right: 0;
}
.gitlab-corner {
  position: absolute;
  top: -14px;
  right: -48px;
  transform: rotate(45deg);
  background: #333;
  border: 40px solid #333;
  border-bottom: none;
  border-top: #333 solid 14px;
}
.gitlab-corner svg {
  width: 60px;
  height: 60px;
  margin-bottom: -4px;
}
.cls-g-1 {
  fill: #aaa;
}
.cls-g-2 {
  fill: #888;
}
.cls-g-3 {
  fill: #eee;
}
.gitlab-corner:hover .cls-g-1 {
  animation: greyCycle 0.6s;
}
.gitlab-corner:hover .cls-g-2 {
  animation: greyCycleMid 0.6s;
}
.gitlab-corner:hover .cls-g-3 {
  animation: greyCycleEnd 0.6s;
}
@keyframes greyCycle {
  100%,
  15%,
  60% {
    fill: #eee;
  }
  30%,
  75% {
    fill: #888;
  }
  45%,
  90% {
    fill: #aaa;
  }
}
@keyframes greyCycleMid {
  100%,
  15%,
  60% {
    fill: #888;
  }
  30%,
  75% {
    fill: #aaa;
  }
  45%,
  90% {
    fill: #eee;
  }
}
@keyframes greyCycleEnd {
  100%,
  15%,
  60% {
    fill: #aaa;
  }
  30%,
  75% {
    fill: #eee;
  }
  45%,
  90% {
    fill: #888;
  }
}
@media (max-width: 500px) {
  .gitlab-corner:hover .cls-g-1,
  .gitlab-corner:hover .cls-g-2,
  .gitlab-corner:hover .cls-g-3 {
    animation: none;
  }
  .gitlab-corner .cls-g-1 {
    animation: greyCycle 0.6s;
  }
  .gitlab-corner .cls-g-2 {
    animation: greyCycleMid 0.6s;
  }
  .gitlab-corner .cls-g-3 {
    animation: greyCycleEnd 0.6s;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component
export default class GitLabCorner extends Vue {}
</script>
