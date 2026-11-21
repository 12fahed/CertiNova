import { graphql } from '../generated'

export const MyMembershipsQuery = graphql(`
  query MyMemberships($userId: uuid!) {
    organization_members(where: { user_id: { _eq: $userId } }, order_by: { created_at: asc }) {
      role
      organization {
        id
        name
        slug
        show_name_on_verify
      }
    }
  }
`)

export const BootstrapOrgMutation = graphql(`
  mutation BootstrapOrg($name: String!, $slug: String!) {
    bootstrap_org(name: $name, slug: $slug) {
      org_id
    }
  }
`)

export const AcceptInviteMutation = graphql(`
  mutation AcceptInvite($token: String!) {
    accept_invite(token: $token) {
      org_id
    }
  }
`)

export const UpdateOrganizationMutation = graphql(`
  mutation UpdateOrganization($id: uuid!, $name: String!, $showNameOnVerify: Boolean!) {
    update_organizations_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, show_name_on_verify: $showNameOnVerify }
    ) {
      id
      name
      show_name_on_verify
    }
  }
`)

export const MembersQuery = graphql(`
  query Members($orgId: uuid!) {
    organization_members(where: { org_id: { _eq: $orgId } }, order_by: { created_at: asc }) {
      user_id
      role
      created_at
      profile {
        full_name
        email
      }
    }
  }
`)

export const InvitesQuery = graphql(`
  query Invites($orgId: uuid!) {
    organization_invites(
      where: { org_id: { _eq: $orgId }, accepted_at: { _is_null: true } }
      order_by: { created_at: desc }
    ) {
      id
      email
      role
      expires_at
      created_at
    }
  }
`)

export const InviteMemberMutation = graphql(`
  mutation InviteMember($orgId: uuid!, $email: String!, $role: String!) {
    invite_member(org_id: $orgId, email: $email, role: $role) {
      invite_id
    }
  }
`)

export const DeleteInviteMutation = graphql(`
  mutation DeleteInvite($id: uuid!) {
    delete_organization_invites_by_pk(id: $id) {
      id
    }
  }
`)

export const UpdateMemberRoleMutation = graphql(`
  mutation UpdateMemberRole($orgId: uuid!, $userId: uuid!, $role: org_role!) {
    update_organization_members_by_pk(
      pk_columns: { org_id: $orgId, user_id: $userId }
      _set: { role: $role }
    ) {
      user_id
      role
    }
  }
`)

export const RemoveMemberMutation = graphql(`
  mutation RemoveMember($orgId: uuid!, $userId: uuid!) {
    delete_organization_members_by_pk(org_id: $orgId, user_id: $userId) {
      user_id
    }
  }
`)

export const LockedLegacyCountQuery = graphql(`
  query LockedLegacyCount($orgId: uuid!) {
    certificates_aggregate(where: { org_id: { _eq: $orgId }, recipient_name: { _is_null: true } }) {
      aggregate {
        count
      }
    }
  }
`)

export const UnlockLegacyDataMutation = graphql(`
  mutation UnlockLegacyData($orgId: uuid!, $password: String!) {
    unlock_legacy_data(org_id: $orgId, password: $password) {
      unlocked_batches
      unlocked_certificates
    }
  }
`)

export const FeatureFlagsQuery = graphql(`
  query FeatureFlags($key: String!) {
    feature_flags(where: { key: { _eq: $key } }) {
      org_id
      enabled
    }
  }
`)
