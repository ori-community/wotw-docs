<script setup lang="ts">
  import type { NuxtError } from '#app'

  const props = defineProps({
    error: Object as () => NuxtError,
  })

  if (props.error) {
    const json = props.error.toJSON ? props.error.toJSON() : JSON.stringify(props.error)
    console.error(json)
  }
</script>

<template>
  <v-app>
    <v-container>
      <span>
        <v-img src="/emoji/orishy.png" alt="oriShy" :width="112" :height="112" />
      </span>
      <template v-if="error">
        <h1>
          {{ `${error.statusCode}${error.statusMessage ? ': ' + error.statusMessage : ''}` }}
        </h1>
      </template>
      <h1 v-else>Something went oribly wrong!</h1>
      <v-btn to="/">Go back home</v-btn>
    </v-container>
  </v-app>
</template>

<style scoped>
  .v-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
</style>
