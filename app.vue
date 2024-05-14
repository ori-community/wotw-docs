<script setup lang="ts">
useHead({
  htmlAttrs: {
    lang: "en",
  },
});
</script>

<template>
  <v-app>
    <div class="environment ceiling" />
    <span class="in-environment">
      <NuxtPage />
    </span>
    <div class="environment floor" />
  </v-app>
</template>

<style lang="scss">
@use "~/assets/scss/main";
</style>

<style>
.environment {
  position: absolute;
  left: 0;
  right: 0;
  background-size: 100% auto;
  filter: brightness(60%);
  pointer-events: none;
}
.in-environment {
  padding: 5vw 0 33vw 0;
}
.ceiling {
  background-image: url("/ceiling.png");
  background-position: 0 -12vw;
  top: 0;
  height: 21vw;
  transform: scaleX(-1);
}
.floor {
  background-image: url("/floor.png");
  background-position: 0 8vw;
  bottom: 0;
  height: 60vw;
  z-index: 1005;
}
</style>
