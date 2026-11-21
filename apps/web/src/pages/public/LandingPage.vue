<script setup lang="ts">
import { Button } from 'frappe-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '@/auth/session'
import IconTile from '@/components/ui/IconTile.vue'
import { TONES, type Tone } from '@/components/ui/tones'

const router = useRouter()
const { isSignedIn } = useSession()
const certificateId = ref('')

// Carried over from the old landing page.
const STATS: { label: string; value: string; color: string }[] = [
  { label: 'Certificates generated', value: '50,000+', color: 'text-brand-600' },
  { label: 'Organisations', value: '1,200+', color: 'text-good-600' },
  { label: 'Events covered', value: '5,000+', color: 'text-accent-600' },
  { label: 'Success rate', value: '99.9%', color: 'text-bad-600' },
]

const STEPS: { title: string; text: string; tone: Tone }[] = [
  {
    title: 'Upload template',
    text: 'Upload your design and mark where the name, QR code and other fields go.',
    tone: 'brand',
  },
  {
    title: 'Add recipients',
    text: 'Import a CSV or XLSX file, or type them in.',
    tone: 'good',
  },
  { title: 'Generate', text: 'Personalised certificates in bulk, in one click.', tone: 'accent' },
  {
    title: 'Download & share',
    text: 'Images, PDFs, or an email to each recipient.',
    tone: 'bad',
  },
  { title: 'Verify', text: 'Anyone scans the QR code to check the certificate.', tone: 'plum' },
]

const FEATURES: { icon: string; title: string; text: string; tone: Tone }[] = [
  {
    icon: 'lucide-zap',
    title: 'Lightning fast',
    text: 'Generate thousands of certificates with an optimised engine.',
    tone: 'brand',
  },
  {
    icon: 'lucide-shield-check',
    title: 'Secure by design',
    text: 'Every request is checked against your organisation and role.',
    tone: 'good',
  },
  {
    icon: 'lucide-layers',
    title: 'Bulk processing',
    text: 'Upload CSV or XLSX files, or enter recipients by hand.',
    tone: 'accent',
  },
  {
    icon: 'lucide-pen-tool',
    title: 'Custom templates',
    text: 'Upload your own design and place each field with a visual editor.',
    tone: 'plum',
  },
  {
    icon: 'lucide-users',
    title: 'Built for teams',
    text: 'Owners, admins and members work on the same events.',
    tone: 'sun',
  },
  {
    icon: 'lucide-award',
    title: 'Quality assured',
    text: 'Consistent formatting and high-resolution output.',
    tone: 'bad',
  },
]

function scrollToVerify() {
  document.getElementById('verify')?.scrollIntoView({ behavior: 'smooth' })
}

function verify() {
  const id = certificateId.value.trim()
  if (id) void router.push({ name: 'verify', params: { id } })
}
</script>

<template>
  <div class="flex flex-col">
    <section>
      <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-12 px-4 py-16 sm:px-6 sm:py-20">
        <div class="flex flex-[1_1_420px] flex-col gap-5">
          <span
            class="self-start rounded-full bg-good-50 px-3 py-1 text-sm font-semibold text-good-700"
          >
            Bulk certificates with QR verification
          </span>
          <h1
            class="text-[36px] font-black leading-tight tracking-tight text-ink-gray-9 sm:text-display"
          >
            Professional certificates, <span class="text-brand-600">made simple</span>
          </h1>
          <p class="max-w-xl text-p-lg text-ink-gray-6">
            Streamline your certificate generation process. Perfect for educational institutions,
            corporate training, and professional certifications.
          </p>
          <div class="flex flex-wrap gap-2">
            <Button
              size="lg"
              variant="solid"
              theme="blue"
              :label="isSignedIn ? 'Go to dashboard' : 'Get started free'"
              :route="{ name: isSignedIn ? 'dashboard' : 'signup' }"
            />
            <Button
              size="lg"
              variant="outline"
              label="Verify a certificate"
              @click="scrollToVerify"
            />
          </div>
        </div>

        <div class="relative grid min-h-80 flex-[1_1_420px] place-items-center" aria-hidden="true">
          <div class="absolute h-52 w-72 translate-x-10 rotate-6 rounded-3xl bg-brand-100" />
          <div
            class="certificate relative flex w-full max-w-md flex-col items-center justify-center gap-2 shadow-lift"
          >
            <div class="text-[11px] uppercase tracking-[0.14em] text-[#7a5a28]">
              Certificate of achievement
            </div>
            <div class="font-script text-5xl text-ink-gray-9">Aarav Mehta</div>
            <div class="h-px w-1/2 bg-[#7a5a28]" />
            <div class="text-base text-ink-gray-8">1st Place · Demo University</div>
            <span class="qr-mark absolute bottom-[10%] left-[8%] size-10" />
          </div>
          <div
            class="absolute bottom-[6%] right-[4%] flex items-center gap-2.5 rounded-xl border border-edge bg-surface-base px-3.5 py-2.5 shadow-lift"
          >
            <span class="grid size-7 place-items-center rounded-full bg-good-600">
              <span class="lucide-check size-4 text-white" />
            </span>
            <div>
              <div class="text-sm font-bold text-ink-gray-9">Verified</div>
              <div class="text-xs text-ink-gray-6">Anyone can check it</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-edge-soft bg-surface-base">
      <dl class="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
        <div v-for="stat in STATS" :key="stat.label">
          <dd class="text-h1 font-bold" :class="stat.color">{{ stat.value }}</dd>
          <dt class="text-sm text-ink-gray-6">{{ stat.label }}</dt>
        </div>
      </dl>
    </section>

    <section class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6">
      <header class="flex flex-col gap-2 text-center">
        <span class="section-label !text-brand-700">How it works</span>
        <h2 class="text-section font-bold text-ink-gray-9">
          Build certificates in five clear steps
        </h2>
      </header>
      <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <li v-for="(step, index) in STEPS" :key="step.title" class="card flex flex-col gap-2.5 p-5">
          <span
            class="grid size-8 place-items-center rounded-lg text-sm font-bold"
            :class="TONES[step.tone].soft"
          >
            {{ index + 1 }}
          </span>
          <h3 class="font-semibold text-ink-gray-9">{{ step.title }}</h3>
          <p class="text-p-sm text-ink-gray-6">{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section class="bg-surface-base">
      <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6">
        <header class="flex flex-col gap-2 text-center">
          <h2 class="text-section font-bold text-ink-gray-9">Why choose CertiNova?</h2>
          <p class="text-p-base text-ink-gray-6">
            Built for organisations that value efficiency, security, and professional quality.
          </p>
        </header>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in FEATURES"
            :key="feature.title"
            class="card flex flex-col gap-3 p-5"
          >
            <IconTile :icon="feature.icon" :tone="feature.tone" size="sm" />
            <h3 class="font-semibold text-ink-gray-9">{{ feature.title }}</h3>
            <p class="text-p-sm text-ink-gray-6">{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="verify" class="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6">
      <div class="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-brand-100 p-8">
        <div>
          <h2 class="text-h1 font-bold text-ink-gray-9">Verify a certificate</h2>
          <p class="mt-1 text-p-base text-ink-gray-7">
            Scan the QR code on the certificate, or type its ID.
          </p>
        </div>
        <form class="flex w-full max-w-lg flex-1 gap-2" @submit.prevent="verify">
          <input
            v-model="certificateId"
            aria-label="Certificate ID"
            placeholder="Certificate ID"
            class="min-w-0 flex-1 rounded-lg border border-brand-200 bg-white px-3.5 py-2.5 text-base focus:border-brand-600 focus:ring-2 focus:ring-brand-200"
          />
          <Button type="submit" size="lg" variant="solid" theme="blue" label="Verify" />
        </form>
      </div>
    </section>

    <section class="bg-brand-600 text-white">
      <div
        class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-4 py-12 sm:px-6"
      >
        <div>
          <h2 class="text-h1 font-bold">Ready to transform your certificate process?</h2>
          <p class="mt-1 text-brand-100">Create a free account and issue your first batch today.</p>
        </div>
        <RouterLink
          :to="{ name: isSignedIn ? 'dashboard' : 'signup' }"
          class="rounded-lg bg-white px-5 py-3 font-semibold text-brand-800 hover:bg-brand-50"
        >
          {{ isSignedIn ? 'Go to dashboard' : 'Create a free account' }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.certificate {
  aspect-ratio: 1.414;
  background: #fbf8f0;
  border: 7px solid #7a5a28;
}

.qr-mark {
  background: repeating-conic-gradient(#101828 0 25%, #fff 0 50%) 0 0 / 8px 8px;
}

.font-script {
  font-family: 'Great Vibes', cursive;
}
</style>
