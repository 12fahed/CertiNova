import { toast } from 'frappe-ui'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { initSession, useSession } from '@/auth/session'
import { errorMessage } from '@/lib/errors'
import { loadMemberships } from '@/org/currentOrg'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    /** Only for signed-out users, for example the login page. */
    guestOnly?: boolean
    requiresAuth?: boolean
    /** The user must belong to at least one organisation. */
    requiresOrg?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('@/pages/public/LandingPage.vue') },
      {
        path: 'privacy-policy',
        name: 'privacy',
        component: () => import('@/pages/public/PrivacyPage.vue'),
        meta: { title: 'Privacy policy' },
      },
      {
        path: 'terms-and-conditions',
        name: 'terms',
        component: () => import('@/pages/public/TermsPage.vue'),
        meta: { title: 'Terms and conditions' },
      },
      {
        path: 'verify/:id',
        name: 'verify',
        component: () => import('@/pages/public/VerifyPage.vue'),
        props: true,
        meta: { title: 'Verify certificate' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: { title: 'Log in', guestOnly: true },
      },
      {
        path: 'signup',
        name: 'signup',
        component: () => import('@/pages/auth/SignupPage.vue'),
        meta: { title: 'Sign up', guestOnly: true },
      },
      {
        path: 'forgot-password',
        name: 'forgot-password',
        component: () => import('@/pages/auth/ForgotPasswordPage.vue'),
        meta: { title: 'Forgot password', guestOnly: true },
      },
      {
        path: 'reset-password',
        name: 'reset-password',
        component: () => import('@/pages/auth/ResetPasswordPage.vue'),
        meta: { title: 'Set a new password' },
      },
      {
        path: 'onboarding',
        name: 'onboarding',
        component: () => import('@/pages/auth/OnboardingPage.vue'),
        meta: { title: 'Create your organisation', requiresAuth: true },
      },
      {
        path: 'invites/accept',
        name: 'accept-invite',
        component: () => import('@/pages/auth/AcceptInvitePage.vue'),
        meta: { title: 'Accept invite', requiresAuth: true },
      },
    ],
  },
  {
    // Full-width work screens without the sidebar.
    path: '/',
    component: () => import('@/layouts/FocusLayout.vue'),
    meta: { requiresAuth: true, requiresOrg: true },
    children: [
      {
        path: 'events/:id/template',
        name: 'template-editor',
        component: () => import('@/pages/events/TemplateEditorPage.vue'),
        props: true,
        meta: { title: 'Template' },
      },
      {
        path: 'events/:id/generate',
        name: 'generate',
        component: () => import('@/pages/events/GeneratePage.vue'),
        props: true,
        meta: { title: 'Generate certificates' },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    meta: { requiresAuth: true, requiresOrg: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'events/:id',
        name: 'event',
        component: () => import('@/pages/events/EventPage.vue'),
        props: true,
        meta: { title: 'Event' },
      },
      {
        path: 'batches/:id',
        name: 'batch',
        component: () => import('@/pages/batches/BatchPage.vue'),
        props: true,
        meta: { title: 'Batch' },
      },
      {
        path: 'history',
        name: 'history',
        component: () => import('@/pages/HistoryPage.vue'),
        meta: { title: 'History' },
      },
      {
        path: 'settings/organisation',
        name: 'org-settings',
        component: () => import('@/pages/settings/OrgSettingsPage.vue'),
        meta: { title: 'Organisation settings' },
      },
      {
        path: 'settings/members',
        name: 'members',
        component: () => import('@/pages/settings/MembersPage.vue'),
        meta: { title: 'Members' },
      },
      // Path of the old app.
      { path: 'certificates', redirect: { name: 'history' } },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { title: 'Page not found' },
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: (_to, _from, saved) => saved ?? { top: 0 },
})

router.beforeEach(async (to) => {
  await initSession()
  const { isSignedIn } = useSession()

  if (to.meta.guestOnly && isSignedIn.value) return { name: 'dashboard' }
  if (to.meta.requiresAuth && !isSignedIn.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.meta.requiresOrg) {
    try {
      const memberships = await loadMemberships()
      if (memberships.length === 0) return { name: 'onboarding' }
    } catch (error) {
      toast.error(errorMessage(error))
      return false
    }
  }
  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · CertiNova` : 'CertiNova'
})
