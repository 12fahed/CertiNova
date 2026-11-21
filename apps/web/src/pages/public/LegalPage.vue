<script setup lang="ts">
import { LINKS, type LegalDocument } from './legal'

defineProps<{ document: LegalDocument }>()
</script>

<template>
  <div class="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-6">
    <header class="flex flex-col gap-2">
      <span class="section-label !text-brand-700">Legal document</span>
      <h1 class="text-section font-bold text-ink-gray-9">{{ document.title }}</h1>
      <p class="text-p-base text-ink-gray-7">{{ document.intro }}</p>
      <p class="text-sm text-ink-gray-5">
        Last updated: {{ document.updated }} · Effective immediately
      </p>
    </header>

    <section
      v-for="section in document.sections"
      :key="section.title"
      class="card flex flex-col gap-4 p-6"
    >
      <h2 class="text-lg font-semibold text-ink-gray-9">{{ section.title }}</h2>
      <div v-for="item in section.items" :key="item.subtitle" class="flex flex-col gap-1">
        <h3 class="font-semibold text-ink-gray-8">{{ item.subtitle }}</h3>
        <p class="text-p-base text-ink-gray-7">{{ item.text }}</p>
      </div>
    </section>

    <section class="card flex flex-col gap-3 bg-brand-50 p-6">
      <h2 class="text-lg font-semibold text-ink-gray-9">
        {{ document.sections.length + 1 }}. Contact Us
      </h2>
      <p class="text-p-base text-ink-gray-7">
        For questions or concerns, reach us on our
        <a class="link" :href="LINKS.discord" target="_blank" rel="noopener">Discord server</a>
        or open an issue on
        <a class="link" :href="LINKS.issues" target="_blank" rel="noopener">GitHub</a>.
      </p>
    </section>
  </div>
</template>
