<!-- Decorative certificate used on the auth and landing pages. -->
<template>
  <div class="rounded-2xl bg-white p-5 text-ink-gray-9" aria-hidden="true">
    <div class="flex flex-col items-center gap-2.5 rounded-lg border-2 border-brand-200 p-5">
      <div class="text-[11px] uppercase tracking-[0.14em] text-ink-gray-6">
        Certificate of achievement
      </div>
      <div class="text-2xl font-bold text-brand-800">Aarav Mehta</div>
      <div class="h-px w-40 bg-brand-200" />
      <div class="flex w-full items-center justify-between">
        <span
          class="inline-flex items-center gap-1.5 rounded-full bg-good-50 px-2.5 py-0.5 text-xs font-semibold text-good-700"
        >
          <span class="lucide-badge-check size-3.5" />
          Verified
        </span>
        <span class="qr-mark size-9" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.qr-mark {
  background: repeating-conic-gradient(#101828 0 25%, #fff 0 50%) 0 0 / 9px 9px;
  outline: 2px solid #101828;
  outline-offset: 2px;
}
</style>
