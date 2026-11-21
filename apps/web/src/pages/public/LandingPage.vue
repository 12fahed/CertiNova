<script setup lang="ts">
import { Button, FormControl } from 'frappe-ui'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '@/auth/session'
import { LINKS } from './legal'

const router = useRouter()
const { isSignedIn } = useSession()
const certificateId = ref('')

const STATS = [
  { label: 'Certificates Generated', value: '50,000+' },
  { label: 'Organizations', value: '1,200+' },
  { label: 'Events Covered', value: '5,000+' },
  { label: 'Success Rate', value: '99.9%' },
]

const STEPS = [
  {
    title: 'Upload Certificate Template',
    text: 'Upload your certificate design and mark where the name, QR code and other fields go.',
  },
  {
    title: 'Upload Recipient Data',
    text: 'Import recipient details from CSV or XLSX, or type them in, to personalize each certificate.',
  },
  {
    title: 'Generate Certificates',
    text: 'Automatically create personalized certificates in bulk with a single click.',
  },
  {
    title: 'Download & Share',
    text: 'Download your batch as images or PDFs, or email each certificate to its recipient.',
  },
  {
    title: 'Verify Certificates',
    text: 'Anyone can validate a certificate instantly by scanning its QR code.',
  },
]

const FEATURES = [
  {
    icon: 'lucide-zap',
    title: 'Lightning Fast Processing',
    text: 'Generate thousands of certificates with our optimized processing engine.',
  },
  {
    icon: 'lucide-shield',
    title: 'Secure by Design',
    text: 'Every request is checked against your organisation and role. Your data stays private to your team.',
  },
  {
    icon: 'lucide-layers',
    title: 'Bulk Processing',
    text: 'Upload CSV or XLSX files or enter data manually to create certificates for multiple recipients.',
  },
  {
    icon: 'lucide-pen-tool',
    title: 'Custom Templates',
    text: 'Upload your own certificate templates and customize positioning with our visual editor.',
  },
  {
    icon: 'lucide-users',
    title: 'Built for Teams',
    text: 'Invite your team as owners, admins or members. Everyone works on the same events.',
  },
  {
    icon: 'lucide-award',
    title: 'Quality Assured',
    text: 'Professional-grade certificates with consistent formatting and high-resolution output.',
  },
]

const SOCIAL = [
  { label: 'GitHub', href: LINKS.github },
  { label: 'Discord', href: LINKS.discord },
  { label: 'Twitter', href: LINKS.twitter },
  { label: 'LinkedIn', href: LINKS.linkedin },
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
    <section
      class="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6"
    >
      <h1 class="text-4xl font-semibold tracking-tight text-ink-gray-9 sm:text-5xl">
        Professional Certificates, Made Simple
      </h1>
      <p class="max-w-2xl text-p-lg text-ink-gray-6">
        Streamline your certificate generation process with our enterprise-grade platform. Perfect
        for educational institutions, corporate training, and professional certifications.
      </p>
      <div class="flex flex-wrap justify-center gap-2">
        <Button
          size="lg"
          variant="solid"
          :label="isSignedIn ? 'Go to dashboard' : 'Get started free'"
          :route="{ name: isSignedIn ? 'dashboard' : 'signup' }"
        />
        <Button size="lg" label="Verify a certificate" @click="scrollToVerify" />
      </div>
    </section>

    <section class="border-y border-outline-gray-1 bg-surface-gray-1">
      <dl class="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6">
        <div v-for="stat in STATS" :key="stat.label" class="text-center">
          <dt class="text-sm text-ink-gray-6">{{ stat.label }}</dt>
          <dd class="text-2xl font-semibold text-ink-gray-9">{{ stat.value }}</dd>
        </div>
      </dl>
    </section>

    <section class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 sm:px-6">
      <header class="flex flex-col gap-2 text-center">
        <span class="text-xs font-medium uppercase tracking-wide text-ink-gray-5"
          >How it works</span
        >
        <h2 class="text-3xl font-semibold text-ink-gray-9">
          Build certificates in five clear steps
        </h2>
        <p class="mx-auto max-w-2xl text-p-base text-ink-gray-6">
          From template upload to recipient verification, CertiNova guides you through a fast,
          secure, and transparent certificate workflow.
        </p>
      </header>
      <ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <li
          v-for="(step, index) in STEPS"
          :key="step.title"
          class="flex flex-col gap-2 rounded-lg border border-outline-gray-2 p-4"
        >
          <span class="text-sm font-semibold tabular-nums text-ink-gray-5">{{ index + 1 }}</span>
          <h3 class="font-medium text-ink-gray-9">{{ step.title }}</h3>
          <p class="text-p-sm text-ink-gray-6">{{ step.text }}</p>
        </li>
      </ol>
    </section>

    <section class="bg-surface-gray-1">
      <div class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-16 sm:px-6">
        <header class="flex flex-col gap-2 text-center">
          <h2 class="text-3xl font-semibold text-ink-gray-9">Why Choose CertiNova?</h2>
          <p class="text-p-base text-ink-gray-6">
            Built for organizations that value efficiency, security, and professional quality.
          </p>
        </header>
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feature in FEATURES"
            :key="feature.title"
            class="flex flex-col gap-2 rounded-lg border border-outline-gray-2 bg-surface-base p-5"
          >
            <span :class="[feature.icon, 'size-5 text-ink-gray-7']" aria-hidden="true" />
            <h3 class="font-medium text-ink-gray-9">{{ feature.title }}</h3>
            <p class="text-p-sm text-ink-gray-6">{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section
      id="verify"
      class="mx-auto flex w-full max-w-xl flex-col gap-4 px-4 py-16 text-center sm:px-6"
    >
      <h2 class="text-2xl font-semibold text-ink-gray-9">Verify a Certificate</h2>
      <p class="text-p-base text-ink-gray-6">
        Scan the QR code on the certificate, or type its ID below.
      </p>
      <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="verify">
        <FormControl
          v-model="certificateId"
          class="flex-1"
          aria-label="Certificate ID"
          placeholder="Certificate ID"
          size="md"
        />
        <Button type="submit" size="md" variant="solid" label="Verify" />
      </form>
    </section>

    <section class="border-t border-outline-gray-1">
      <div
        class="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6"
      >
        <h2 class="text-2xl font-semibold text-ink-gray-9">
          Ready to Transform Your Certificate Process?
        </h2>
        <p class="max-w-xl text-p-base text-ink-gray-6">
          Join the organizations already using CertiNova to streamline their certification
          workflows.
        </p>
        <Button
          size="lg"
          variant="solid"
          :label="isSignedIn ? 'Go to dashboard' : 'Create a free account'"
          :route="{ name: isSignedIn ? 'dashboard' : 'signup' }"
        />
        <nav class="flex gap-4 pt-4 text-sm" aria-label="Social links">
          <a
            v-for="link in SOCIAL"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener"
            class="text-ink-gray-5 hover:text-ink-gray-9"
          >
            {{ link.label }}
          </a>
        </nav>
      </div>
    </section>
  </div>
</template>
