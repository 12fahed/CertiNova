<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import { Button, Dropdown, ErrorMessage, LoadingText, dialog, toast } from 'frappe-ui'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import InviteMemberCard from '@/components/InviteMemberCard.vue'
import InitialsAvatar from '@/components/ui/InitialsAvatar.vue'
import PageTitle from '@/components/ui/PageTitle.vue'
import TonePill from '@/components/ui/TonePill.vue'
import type { Tone } from '@/components/ui/tones'
import { useSession } from '@/auth/session'
import {
  DeleteInviteMutation,
  InvitesQuery,
  MembersQuery,
  RemoveMemberMutation,
  UpdateMemberRoleMutation,
} from '@/graphql/operations/orgs'
import { errorMessage, unwrap } from '@/lib/errors'
import { formatDate, plural } from '@/lib/format'
import { loadMemberships, selectOrg, useCurrentOrg, type OrgRole } from '@/org/currentOrg'

const router = useRouter()
const { user } = useSession()
const { orgId, isAdmin, isOwner } = useCurrentOrg()
const variables = computed(() => ({ orgId: orgId.value }))
const membersQuery = useQuery({ query: MembersQuery, variables })
const invitesQuery = useQuery({
  query: InvitesQuery,
  variables,
  pause: computed(() => !isAdmin.value),
})
const updateRole = useMutation(UpdateMemberRoleMutation)
const removeMember = useMutation(RemoveMemberMutation)
const deleteInvite = useMutation(DeleteInviteMutation)

const members = computed(() => membersQuery.data.value?.organization_members ?? [])
const invites = computed(() => invitesQuery.data.value?.organization_invites ?? [])

const ROLE_LABELS: Record<OrgRole, string> = { owner: 'Owner', admin: 'Admin', member: 'Member' }
const ROLE_TONES: Record<OrgRole, Tone> = { owner: 'plum', admin: 'brand', member: 'neutral' }

async function run(task: () => Promise<unknown>, message: string) {
  try {
    await task()
    toast.success(message)
    membersQuery.executeQuery({ requestPolicy: 'network-only' })
    invitesQuery.executeQuery({ requestPolicy: 'network-only' })
  } catch (error) {
    toast.error(errorMessage(error))
  }
}

function canManage(role: OrgRole): boolean {
  return isOwner.value || (isAdmin.value && role !== 'owner')
}

function memberMenu(member: (typeof members.value)[number]) {
  const roles: OrgRole[] = isOwner.value ? ['owner', 'admin', 'member'] : ['admin', 'member']
  return [
    {
      group: 'Role',
      options: roles.map((role) => ({
        label: ROLE_LABELS[role],
        icon: member.role === role ? 'lucide-check' : null,
        onClick: () =>
          member.role !== role &&
          run(
            async () =>
              unwrap(
                await updateRole.executeMutation({
                  orgId: orgId.value,
                  userId: member.user_id,
                  role,
                }),
              ),
            'Role changed.',
          ),
      })),
    },
    {
      group: 'Member',
      options: [
        {
          label: 'Remove',
          icon: 'lucide-user-minus',
          theme: 'red' as const,
          onClick: () => confirmRemove(member),
        },
      ],
    },
  ]
}

function confirmRemove(member: (typeof members.value)[number]) {
  dialog.danger({
    title: 'Remove this person?',
    message: `${member.profile.full_name || member.profile.email} loses access to this organisation.`,
    confirmLabel: 'Remove',
    onConfirm: () =>
      run(
        async () =>
          unwrap(
            await removeMember.executeMutation({ orgId: orgId.value, userId: member.user_id }),
          ),
        'Person removed.',
      ),
  })
}

function confirmLeave() {
  dialog.danger({
    title: 'Leave this organisation?',
    message: 'You lose access to its events and certificates. An admin must invite you again.',
    confirmLabel: 'Leave',
    onConfirm: async () => {
      try {
        unwrap(await removeMember.executeMutation({ orgId: orgId.value, userId: user.value!.id }))
        selectOrg(null)
        await loadMemberships(true)
        await router.replace({ name: 'dashboard' })
      } catch (error) {
        toast.error(errorMessage(error))
      }
    },
  })
}
</script>

<template>
  <PageTitle
    title="Members"
    subtitle="Owners and admins manage events, designs and people. Members make and send certificates."
  />

  <ErrorMessage v-if="membersQuery.error.value" :message="errorMessage(membersQuery.error.value)" />
  <LoadingText v-else-if="membersQuery.fetching.value && !membersQuery.data.value" />
  <div v-else class="flex flex-wrap items-start gap-5">
    <section class="card min-w-0 flex-[3_1_420px] overflow-hidden">
      <div class="flex items-center justify-between px-4 py-3.5">
        <h2 class="font-semibold text-ink-gray-9">People</h2>
        <span class="text-sm text-ink-gray-6">{{ plural(members.length, 'member') }}</span>
      </div>
      <div
        v-for="member in members"
        :key="member.user_id"
        class="flex flex-wrap items-center gap-3 border-t border-edge-soft px-4 py-3"
      >
        <InitialsAvatar :name="member.profile.full_name || member.profile.email" />
        <div class="min-w-40 flex-1">
          <div class="truncate font-semibold text-ink-gray-9">
            {{ member.profile.full_name || member.profile.email }}
            <span v-if="member.user_id === user?.id" class="font-normal text-ink-gray-5"
              >(you)</span
            >
          </div>
          <div class="truncate text-sm text-ink-gray-6">{{ member.profile.email }}</div>
        </div>
        <TonePill :tone="ROLE_TONES[member.role]" :label="ROLE_LABELS[member.role]" />
        <Dropdown
          v-if="member.user_id !== user?.id && canManage(member.role)"
          :options="memberMenu(member)"
          align="end"
          :button="{ icon: 'lucide-ellipsis', label: 'Member options', variant: 'subtle' }"
        />
        <Button
          v-else-if="member.user_id === user?.id"
          variant="ghost"
          label="Leave"
          @click="confirmLeave"
        />
      </div>

      <div v-if="isAdmin" class="border-t border-edge-soft bg-canvas px-4 py-3.5">
        <div class="section-label mb-2">Open invites</div>
        <p v-if="invites.length === 0" class="text-sm text-ink-gray-6">No open invites.</p>
        <div
          v-for="invite in invites"
          :key="invite.id"
          class="flex flex-wrap items-center gap-3 py-1.5"
        >
          <span
            class="grid size-8 place-items-center rounded-full border-[1.5px] border-dashed border-edge-strong text-ink-gray-5"
            aria-hidden="true"
          >
            <span class="lucide-mail size-3.5" />
          </span>
          <div class="min-w-40 flex-1">
            <div class="truncate text-sm text-ink-gray-9">{{ invite.email }}</div>
            <div class="text-xs text-ink-gray-6">
              {{ ROLE_LABELS[invite.role] }} · ends {{ formatDate(invite.expires_at) }}
            </div>
          </div>
          <Button
            variant="ghost"
            theme="red"
            label="Cancel invite"
            @click="
              run(
                async () => unwrap(await deleteInvite.executeMutation({ id: invite.id })),
                'Invite cancelled.',
              )
            "
          />
        </div>
      </div>
    </section>

    <div v-if="isAdmin" class="min-w-0 flex-[2_1_300px]">
      <InviteMemberCard @invited="invitesQuery.executeQuery({ requestPolicy: 'network-only' })" />
    </div>
  </div>
</template>
