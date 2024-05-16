<script setup lang="ts">
  import type { Toc } from '@nuxt/content/types'

  const props = defineProps<{ toc: Toc | undefined }>()

  const activeLink = ref('')

  onMounted(() => {
    const articleElement: HTMLElement | undefined = document.getElementsByTagName('article')[0]

    if (articleElement?.firstElementChild) {
      const observedElements: Map<Element, [string, boolean]> = new Map()

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const target = observedElements.get(entry.target)
            if (target) {
              target[1] = entry.isIntersecting
            }
          }
          for (const element of observedElements.values()) {
            if (element[1]) {
              activeLink.value = element[0]
              break
            }
          }
        },
        {
          rootMargin: '-60px 0px 0px 0px',
          threshold: [0, 1],
        },
      )

      let currentId = ''
      for (const element of articleElement.firstElementChild.children) {
        switch (element.tagName) {
          case 'H2':
          case 'H3':
            currentId = element.id
        }
        if (currentId) {
          observedElements.set(element, [currentId, false])
          observer.observe(element)
        }
      }
    }
  })
</script>

<template>
  <v-list class="pt-0">
    <v-list-item subtitle="Contents" />
    <v-divider />
    <template v-if="props.toc" v-for="h2 in props.toc.links" :key="h2.id">
      <v-list-item density="compact" :to="`#${h2.id}`" :title="h2.text" :active="activeLink === h2.id" />
      <template v-for="h3 in h2.children" :key="h3.id">
        <v-list-item :to="`#${h3.id}`" :subtitle="h3.text" :active="activeLink === h3.id" class="ps-8 tiny" />
      </template>
    </template>
  </v-list>
</template>

<style>
  .tiny {
    min-height: 32px !important;
  }
</style>
