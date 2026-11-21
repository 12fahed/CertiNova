<script setup lang="ts">
import LegalPage from './LegalPage.vue'
import { TERMS } from './legal'
</script>

<template>
  <LegalPage :document="TERMS" />
</template>
