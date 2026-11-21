<script setup lang="ts">
import BrandMark from '@/components/ui/BrandMark.vue'
import SampleCertificate from '@/components/ui/SampleCertificate.vue'
</script>

<template>
  <div class="flex min-h-full flex-wrap bg-canvas">
    <section
      class="hidden flex-1 basis-[420px] flex-col justify-between gap-10 bg-brand-600 p-12 text-white lg:flex"
    >
      <RouterLink :to="{ name: 'home' }" class="self-start"><BrandMark inverted /></RouterLink>
      <div class="flex max-w-md flex-col gap-8">
        <SampleCertificate class="-rotate-2 shadow-lift" />
        <div class="flex flex-col gap-3">
          <h2 class="text-section font-bold">Make, send and verify certificates in bulk.</h2>
          <p class="text-p-base text-brand-100">
            Upload a design, add recipients, and every certificate gets a QR code that anyone can
            check.
          </p>
        </div>
      </div>
      <p class="text-sm text-brand-200">
        Used CertiNova before? Log in with your old email and password.
      </p>
    </section>

    <section
      class="flex flex-1 basis-[420px] flex-col items-center justify-center gap-8 px-4 py-10"
    >
      <RouterLink :to="{ name: 'home' }" class="lg:hidden"><BrandMark /></RouterLink>
      <div class="card w-full max-w-sm p-8 shadow-sm">
        <RouterView />
      </div>
    </section>
  </div>
</template>
