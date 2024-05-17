<script setup lang="ts">
  const page = useCurrentContent()
  const toc = page.value?.body?.toc

  const showNavigation = ref(true)
</script>

<template>
  <v-app-bar :title="page?.title">
    <template #prepend>
      <v-btn icon="mdi-table-of-contents" @click="showNavigation = !showNavigation" />
    </template>
  </v-app-bar>
  <v-navigation-drawer v-model="showNavigation" permanent :width="280">
    <TableOfContents :toc="toc" />
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
