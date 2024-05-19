<script setup lang="ts">
  import { mdiTableOfContents } from '@mdi/js'

  const page = useCurrentContent()

  const showNavigation = ref(true)
</script>

<template>
  <v-app-bar :title="page?.title">
    <template #prepend>
      <v-btn :icon="mdiTableOfContents" @click="showNavigation = !showNavigation" />
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="showNavigation" permanent :width="280">
    <TableOfContents :toc="page?.body?.toc" />
  </v-navigation-drawer>
  <v-main>
    <v-container>
      <article v-if="page">
        <ContentRenderer :key="page._id" :value="page">
          <template #empty />
        </ContentRenderer>
      </article>
    </v-container>
  </v-main>
</template>

<style>
  :target,
  :is(h2, h3, h4)[id] {
    scroll-margin-top: var(--v-layout-top);
  }
</style>
