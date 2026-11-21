<script setup lang="ts">
import { useMutation, useQuery } from '@urql/vue'
import {
  Badge,
  Button,
  Dropdown,
  ErrorMessage,
  LoadingText,
  PageHeader,
  PageHeaderTitle,
  dialog,
  toast,
} from 'frappe-ui'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import InviteMemberDialog from '@/components/InviteMemberDialog.vue'
import { useSession } from '@/auth/session'
import {
  DeleteInviteMutation,
  InvitesQuery,
  MembersQuery,
  RemoveMemberMutation,
  UpdateMemberRoleMutation,
} from '@/graphql/operations/orgs'
import { errorMessage, unwrap } from '@/lib/errors'
import { formatDate } from '@/lib/format'
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
const inviting = ref(false)

const ROLE_LABELS: Record<OrgRole, string> = { owner: 'Owner', admin: 'Admin', member: 'Member' }

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
  <PageHeader>
    <PageHeaderTitle title="Members" />
    <Button
      v-if="isAdmin"
      variant="solid"
      icon-left="lucide-user-plus"
      label="Invite"
      @click="inviting = true"
    />
  </PageHeader>

  <ErrorMessage v-if="membersQuery.error.value" :message="errorMessage(membersQuery.error.value)" />
  <LoadingText v-else-if="membersQuery.fetching.value && !membersQuery.data.value" />
  <ul v-else class="divide-y divide-outline-gray-1 rounded-lg border border-outline-gray-2">
    <li
      v-for="member in members"
      :key="member.user_id"
      class="flex items-center justify-between gap-2 px-4 py-3"
    >
      <div class="flex min-w-0 flex-col">
        <span class="truncate font-medium text-ink-gray-9">
          {{ member.profile.full_name || member.profile.email }}
          <span v-if="member.user_id === user?.id" class="text-ink-gray-5">(you)</span>
        </span>
        <span class="truncate text-sm text-ink-gray-6">{{ member.profile.email }}</span>
      </div>
      <div class="flex items-center gap-2">
        <Badge
          :label="ROLE_LABELS[member.role]"
          :theme="member.role === 'owner' ? 'violet' : 'gray'"
        />
        <Dropdown
          v-if="member.user_id !== user?.id && canManage(member.role)"
          :options="memberMenu(member)"
          :button="{ icon: 'lucide-ellipsis', label: 'Member options', variant: 'ghost' }"
        />
        <Button
          v-else-if="member.user_id === user?.id"
          variant="ghost"
          label="Leave"
          @click="confirmLeave"
        />
      </div>
    </li>
  </ul>

  <section v-if="isAdmin" class="flex flex-col gap-2">
    <h2 class="font-medium text-ink-gray-9">Open invites</h2>
    <p v-if="invites.length === 0" class="text-sm text-ink-gray-6">No open invites.</p>
    <ul v-else class="divide-y divide-outline-gray-1 rounded-lg border border-outline-gray-2">
      <li
        v-for="invite in invites"
        :key="invite.id"
        class="flex items-center justify-between gap-2 px-4 py-3"
      >
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-ink-gray-9">{{ invite.email }}</span>
          <span class="text-sm text-ink-gray-6">
            {{ ROLE_LABELS[invite.role] }} · ends {{ formatDate(invite.expires_at) }}
          </span>
        </div>
        <Button
          variant="ghost"
          label="Cancel invite"
          @click="
            run(
              async () => unwrap(await deleteInvite.executeMutation({ id: invite.id })),
              'Invite cancelled.',
            )
          "
        />
      </li>
    </ul>
  </section>

  <InviteMemberDialog
    v-model:open="inviting"
    @invited="invitesQuery.executeQuery({ requestPolicy: 'network-only' })"
  />
</template>
