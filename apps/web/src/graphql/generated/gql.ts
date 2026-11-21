/* eslint-disable */
import * as types from './graphql'
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  '\n  mutation CreateBatch($object: batches_insert_input!) {\n    insert_batches_one(object: $object) {\n      id\n    }\n  }\n': typeof types.CreateBatchDocument
  '\n  mutation StartBatchRender($batchId: uuid!) {\n    start_batch_render(batch_id: $batchId) {\n      job_id\n    }\n  }\n': typeof types.StartBatchRenderDocument
  '\n  query Batch($id: uuid!, $limit: Int!, $offset: Int!) {\n    batches_by_pk(id: $id) {\n      id\n      org_id\n      status\n      recipient_count\n      has_rank\n      created_at\n      event {\n        id\n        name\n      }\n      creator {\n        full_name\n        email\n      }\n      rendered: certificates_aggregate(where: { render_status: { _eq: done } }) {\n        aggregate {\n          count\n        }\n      }\n      without_email: certificates_aggregate(where: { recipient_email: { _is_null: true } }) {\n        aggregate {\n          count\n        }\n      }\n      certificates(order_by: { created_at: asc }, limit: $limit, offset: $offset) {\n        id\n        recipient_name\n        recipient_email\n        rank\n        file_path\n        render_status\n        revoked_at\n        email_deliveries(order_by: { created_at: desc }, limit: 1) {\n          status\n          error\n          sent_at\n        }\n      }\n    }\n  }\n': typeof types.BatchDocument
  '\n  subscription BatchJobs($batchId: uuid!) {\n    jobs(where: { ref_id: { _eq: $batchId } }, order_by: { created_at: desc }, limit: 10) {\n      id\n      kind\n      status\n      progress\n      total\n      error\n      result\n      created_at\n      finished_at\n    }\n  }\n': typeof types.BatchJobsDocument
  '\n  mutation ExportBatch($batchId: uuid!, $format: ExportFormat!) {\n    export_batch(batch_id: $batchId, format: $format) {\n      job_id\n    }\n  }\n': typeof types.ExportBatchDocument
  '\n  query ExportUrl($jobId: uuid!) {\n    get_export_url(job_id: $jobId) {\n      url\n      expires_at\n    }\n  }\n': typeof types.ExportUrlDocument
  '\n  mutation SendBatchEmails($batchId: uuid!) {\n    send_batch_emails(batch_id: $batchId) {\n      job_id\n    }\n  }\n': typeof types.SendBatchEmailsDocument
  '\n  query DeliveryCounts($batchId: uuid!) {\n    sent: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: sent } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    failed: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: failed } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    queued: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: queued } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n': typeof types.DeliveryCountsDocument
  '\n  query CertificatesSearch(\n    $where: certificates_bool_exp!\n    $limit: Int!\n    $offset: Int!\n    $orderBy: [certificates_order_by!]\n  ) {\n    certificates(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {\n      id\n      recipient_name\n      recipient_email\n      rank\n      created_at\n      revoked_at\n      revoked_reason\n      render_status\n      batch {\n        id\n        event {\n          id\n          name\n        }\n      }\n    }\n    certificates_aggregate(where: $where) {\n      aggregate {\n        count\n      }\n    }\n  }\n': typeof types.CertificatesSearchDocument
  '\n  mutation RevokeCertificate($id: uuid!, $revokedAt: timestamptz, $reason: String) {\n    update_certificates_by_pk(\n      pk_columns: { id: $id }\n      _set: { revoked_at: $revokedAt, revoked_reason: $reason }\n    ) {\n      id\n      revoked_at\n      revoked_reason\n    }\n  }\n': typeof types.RevokeCertificateDocument
  '\n  query Dashboard($orgId: uuid!) {\n    org_stats(where: { org_id: { _eq: $orgId } }) {\n      events_count\n      batches_count\n      certificates_count\n      last_batch_at\n    }\n    events(\n      where: { org_id: { _eq: $orgId }, deleted_at: { _is_null: true } }\n      order_by: { event_date: desc }\n    ) {\n      id\n      name\n      issuer_name\n      event_date\n      template {\n        id\n        image_path\n      }\n      batches_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n': typeof types.DashboardDocument
  '\n  query Event($id: uuid!) {\n    events_by_pk(id: $id) {\n      id\n      org_id\n      name\n      issuer_name\n      event_date\n      deleted_at\n      template {\n        id\n        image_path\n        image_width\n        image_height\n        fields {\n          field_key\n          x\n          y\n          width\n          height\n          font_family\n          font_weight\n          font_style\n          text_decoration\n          color\n        }\n      }\n      batches(order_by: { created_at: desc }) {\n        id\n        status\n        recipient_count\n        created_at\n        creator {\n          full_name\n          email\n        }\n      }\n    }\n  }\n': typeof types.EventDocument
  '\n  mutation CreateEvent($object: events_insert_input!) {\n    insert_events_one(object: $object) {\n      id\n    }\n  }\n': typeof types.CreateEventDocument
  '\n  mutation UpdateEvent($id: uuid!, $set: events_set_input!) {\n    update_events_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n      name\n      issuer_name\n      event_date\n      deleted_at\n    }\n  }\n': typeof types.UpdateEventDocument
  '\n  query Fonts {\n    fonts(order_by: { family: asc }) {\n      family\n      category\n      is_system\n      render_family\n    }\n  }\n': typeof types.FontsDocument
  '\n  mutation CreateTemplate($object: templates_insert_input!) {\n    insert_templates_one(object: $object) {\n      id\n    }\n  }\n': typeof types.CreateTemplateDocument
  '\n  mutation ReplaceTemplate(\n    $id: uuid!\n    $set: templates_set_input!\n    $fields: [template_fields_insert_input!]!\n  ) {\n    delete_template_fields(where: { template_id: { _eq: $id } }) {\n      affected_rows\n    }\n    insert_template_fields(objects: $fields) {\n      affected_rows\n    }\n    update_templates_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n': typeof types.ReplaceTemplateDocument
  '\n  query EventOptions($orgId: uuid!) {\n    events(where: { org_id: { _eq: $orgId } }, order_by: { event_date: desc }) {\n      id\n      name\n    }\n  }\n': typeof types.EventOptionsDocument
  '\n  query MyMemberships($userId: uuid!) {\n    organization_members(where: { user_id: { _eq: $userId } }, order_by: { created_at: asc }) {\n      role\n      organization {\n        id\n        name\n        slug\n        show_name_on_verify\n      }\n    }\n  }\n': typeof types.MyMembershipsDocument
  '\n  mutation BootstrapOrg($name: String!, $slug: String!) {\n    bootstrap_org(name: $name, slug: $slug) {\n      org_id\n    }\n  }\n': typeof types.BootstrapOrgDocument
  '\n  mutation AcceptInvite($token: String!) {\n    accept_invite(token: $token) {\n      org_id\n    }\n  }\n': typeof types.AcceptInviteDocument
  '\n  mutation UpdateOrganization($id: uuid!, $name: String!, $showNameOnVerify: Boolean!) {\n    update_organizations_by_pk(\n      pk_columns: { id: $id }\n      _set: { name: $name, show_name_on_verify: $showNameOnVerify }\n    ) {\n      id\n      name\n      show_name_on_verify\n    }\n  }\n': typeof types.UpdateOrganizationDocument
  '\n  query Members($orgId: uuid!) {\n    organization_members(where: { org_id: { _eq: $orgId } }, order_by: { created_at: asc }) {\n      user_id\n      role\n      created_at\n      profile {\n        full_name\n        email\n      }\n    }\n  }\n': typeof types.MembersDocument
  '\n  query Invites($orgId: uuid!) {\n    organization_invites(\n      where: { org_id: { _eq: $orgId }, accepted_at: { _is_null: true } }\n      order_by: { created_at: desc }\n    ) {\n      id\n      email\n      role\n      expires_at\n      created_at\n    }\n  }\n': typeof types.InvitesDocument
  '\n  mutation InviteMember($orgId: uuid!, $email: String!, $role: String!) {\n    invite_member(org_id: $orgId, email: $email, role: $role) {\n      invite_id\n    }\n  }\n': typeof types.InviteMemberDocument
  '\n  mutation DeleteInvite($id: uuid!) {\n    delete_organization_invites_by_pk(id: $id) {\n      id\n    }\n  }\n': typeof types.DeleteInviteDocument
  '\n  mutation UpdateMemberRole($orgId: uuid!, $userId: uuid!, $role: org_role!) {\n    update_organization_members_by_pk(\n      pk_columns: { org_id: $orgId, user_id: $userId }\n      _set: { role: $role }\n    ) {\n      user_id\n      role\n    }\n  }\n': typeof types.UpdateMemberRoleDocument
  '\n  mutation RemoveMember($orgId: uuid!, $userId: uuid!) {\n    delete_organization_members_by_pk(org_id: $orgId, user_id: $userId) {\n      user_id\n    }\n  }\n': typeof types.RemoveMemberDocument
  '\n  query LockedLegacyCount($orgId: uuid!) {\n    certificates_aggregate(where: { org_id: { _eq: $orgId }, recipient_name: { _is_null: true } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n': typeof types.LockedLegacyCountDocument
  '\n  mutation UnlockLegacyData($orgId: uuid!, $password: String!) {\n    unlock_legacy_data(org_id: $orgId, password: $password) {\n      unlocked_batches\n      unlocked_certificates\n    }\n  }\n': typeof types.UnlockLegacyDataDocument
  '\n  query FeatureFlags($key: String!) {\n    feature_flags(where: { key: { _eq: $key } }) {\n      org_id\n      enabled\n    }\n  }\n': typeof types.FeatureFlagsDocument
  '\n  query VerifyCertificate($certificateId: uuid!) {\n    verify_certificate(args: { certificate_id: $certificateId }) {\n      certificate_id\n      organisation_name\n      issuer_name\n      event_name\n      event_date\n      issued_at\n      recipient_name\n      rank\n      is_revoked\n    }\n  }\n': typeof types.VerifyCertificateDocument
  '\n  query VerifyPreviewUrl($certificateId: uuid!) {\n    get_verify_preview_url(certificate_id: $certificateId) {\n      url\n    }\n  }\n': typeof types.VerifyPreviewUrlDocument
}
const documents: Documents = {
  '\n  mutation CreateBatch($object: batches_insert_input!) {\n    insert_batches_one(object: $object) {\n      id\n    }\n  }\n':
    types.CreateBatchDocument,
  '\n  mutation StartBatchRender($batchId: uuid!) {\n    start_batch_render(batch_id: $batchId) {\n      job_id\n    }\n  }\n':
    types.StartBatchRenderDocument,
  '\n  query Batch($id: uuid!, $limit: Int!, $offset: Int!) {\n    batches_by_pk(id: $id) {\n      id\n      org_id\n      status\n      recipient_count\n      has_rank\n      created_at\n      event {\n        id\n        name\n      }\n      creator {\n        full_name\n        email\n      }\n      rendered: certificates_aggregate(where: { render_status: { _eq: done } }) {\n        aggregate {\n          count\n        }\n      }\n      without_email: certificates_aggregate(where: { recipient_email: { _is_null: true } }) {\n        aggregate {\n          count\n        }\n      }\n      certificates(order_by: { created_at: asc }, limit: $limit, offset: $offset) {\n        id\n        recipient_name\n        recipient_email\n        rank\n        file_path\n        render_status\n        revoked_at\n        email_deliveries(order_by: { created_at: desc }, limit: 1) {\n          status\n          error\n          sent_at\n        }\n      }\n    }\n  }\n':
    types.BatchDocument,
  '\n  subscription BatchJobs($batchId: uuid!) {\n    jobs(where: { ref_id: { _eq: $batchId } }, order_by: { created_at: desc }, limit: 10) {\n      id\n      kind\n      status\n      progress\n      total\n      error\n      result\n      created_at\n      finished_at\n    }\n  }\n':
    types.BatchJobsDocument,
  '\n  mutation ExportBatch($batchId: uuid!, $format: ExportFormat!) {\n    export_batch(batch_id: $batchId, format: $format) {\n      job_id\n    }\n  }\n':
    types.ExportBatchDocument,
  '\n  query ExportUrl($jobId: uuid!) {\n    get_export_url(job_id: $jobId) {\n      url\n      expires_at\n    }\n  }\n':
    types.ExportUrlDocument,
  '\n  mutation SendBatchEmails($batchId: uuid!) {\n    send_batch_emails(batch_id: $batchId) {\n      job_id\n    }\n  }\n':
    types.SendBatchEmailsDocument,
  '\n  query DeliveryCounts($batchId: uuid!) {\n    sent: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: sent } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    failed: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: failed } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    queued: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: queued } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n':
    types.DeliveryCountsDocument,
  '\n  query CertificatesSearch(\n    $where: certificates_bool_exp!\n    $limit: Int!\n    $offset: Int!\n    $orderBy: [certificates_order_by!]\n  ) {\n    certificates(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {\n      id\n      recipient_name\n      recipient_email\n      rank\n      created_at\n      revoked_at\n      revoked_reason\n      render_status\n      batch {\n        id\n        event {\n          id\n          name\n        }\n      }\n    }\n    certificates_aggregate(where: $where) {\n      aggregate {\n        count\n      }\n    }\n  }\n':
    types.CertificatesSearchDocument,
  '\n  mutation RevokeCertificate($id: uuid!, $revokedAt: timestamptz, $reason: String) {\n    update_certificates_by_pk(\n      pk_columns: { id: $id }\n      _set: { revoked_at: $revokedAt, revoked_reason: $reason }\n    ) {\n      id\n      revoked_at\n      revoked_reason\n    }\n  }\n':
    types.RevokeCertificateDocument,
  '\n  query Dashboard($orgId: uuid!) {\n    org_stats(where: { org_id: { _eq: $orgId } }) {\n      events_count\n      batches_count\n      certificates_count\n      last_batch_at\n    }\n    events(\n      where: { org_id: { _eq: $orgId }, deleted_at: { _is_null: true } }\n      order_by: { event_date: desc }\n    ) {\n      id\n      name\n      issuer_name\n      event_date\n      template {\n        id\n        image_path\n      }\n      batches_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n':
    types.DashboardDocument,
  '\n  query Event($id: uuid!) {\n    events_by_pk(id: $id) {\n      id\n      org_id\n      name\n      issuer_name\n      event_date\n      deleted_at\n      template {\n        id\n        image_path\n        image_width\n        image_height\n        fields {\n          field_key\n          x\n          y\n          width\n          height\n          font_family\n          font_weight\n          font_style\n          text_decoration\n          color\n        }\n      }\n      batches(order_by: { created_at: desc }) {\n        id\n        status\n        recipient_count\n        created_at\n        creator {\n          full_name\n          email\n        }\n      }\n    }\n  }\n':
    types.EventDocument,
  '\n  mutation CreateEvent($object: events_insert_input!) {\n    insert_events_one(object: $object) {\n      id\n    }\n  }\n':
    types.CreateEventDocument,
  '\n  mutation UpdateEvent($id: uuid!, $set: events_set_input!) {\n    update_events_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n      name\n      issuer_name\n      event_date\n      deleted_at\n    }\n  }\n':
    types.UpdateEventDocument,
  '\n  query Fonts {\n    fonts(order_by: { family: asc }) {\n      family\n      category\n      is_system\n      render_family\n    }\n  }\n':
    types.FontsDocument,
  '\n  mutation CreateTemplate($object: templates_insert_input!) {\n    insert_templates_one(object: $object) {\n      id\n    }\n  }\n':
    types.CreateTemplateDocument,
  '\n  mutation ReplaceTemplate(\n    $id: uuid!\n    $set: templates_set_input!\n    $fields: [template_fields_insert_input!]!\n  ) {\n    delete_template_fields(where: { template_id: { _eq: $id } }) {\n      affected_rows\n    }\n    insert_template_fields(objects: $fields) {\n      affected_rows\n    }\n    update_templates_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n':
    types.ReplaceTemplateDocument,
  '\n  query EventOptions($orgId: uuid!) {\n    events(where: { org_id: { _eq: $orgId } }, order_by: { event_date: desc }) {\n      id\n      name\n    }\n  }\n':
    types.EventOptionsDocument,
  '\n  query MyMemberships($userId: uuid!) {\n    organization_members(where: { user_id: { _eq: $userId } }, order_by: { created_at: asc }) {\n      role\n      organization {\n        id\n        name\n        slug\n        show_name_on_verify\n      }\n    }\n  }\n':
    types.MyMembershipsDocument,
  '\n  mutation BootstrapOrg($name: String!, $slug: String!) {\n    bootstrap_org(name: $name, slug: $slug) {\n      org_id\n    }\n  }\n':
    types.BootstrapOrgDocument,
  '\n  mutation AcceptInvite($token: String!) {\n    accept_invite(token: $token) {\n      org_id\n    }\n  }\n':
    types.AcceptInviteDocument,
  '\n  mutation UpdateOrganization($id: uuid!, $name: String!, $showNameOnVerify: Boolean!) {\n    update_organizations_by_pk(\n      pk_columns: { id: $id }\n      _set: { name: $name, show_name_on_verify: $showNameOnVerify }\n    ) {\n      id\n      name\n      show_name_on_verify\n    }\n  }\n':
    types.UpdateOrganizationDocument,
  '\n  query Members($orgId: uuid!) {\n    organization_members(where: { org_id: { _eq: $orgId } }, order_by: { created_at: asc }) {\n      user_id\n      role\n      created_at\n      profile {\n        full_name\n        email\n      }\n    }\n  }\n':
    types.MembersDocument,
  '\n  query Invites($orgId: uuid!) {\n    organization_invites(\n      where: { org_id: { _eq: $orgId }, accepted_at: { _is_null: true } }\n      order_by: { created_at: desc }\n    ) {\n      id\n      email\n      role\n      expires_at\n      created_at\n    }\n  }\n':
    types.InvitesDocument,
  '\n  mutation InviteMember($orgId: uuid!, $email: String!, $role: String!) {\n    invite_member(org_id: $orgId, email: $email, role: $role) {\n      invite_id\n    }\n  }\n':
    types.InviteMemberDocument,
  '\n  mutation DeleteInvite($id: uuid!) {\n    delete_organization_invites_by_pk(id: $id) {\n      id\n    }\n  }\n':
    types.DeleteInviteDocument,
  '\n  mutation UpdateMemberRole($orgId: uuid!, $userId: uuid!, $role: org_role!) {\n    update_organization_members_by_pk(\n      pk_columns: { org_id: $orgId, user_id: $userId }\n      _set: { role: $role }\n    ) {\n      user_id\n      role\n    }\n  }\n':
    types.UpdateMemberRoleDocument,
  '\n  mutation RemoveMember($orgId: uuid!, $userId: uuid!) {\n    delete_organization_members_by_pk(org_id: $orgId, user_id: $userId) {\n      user_id\n    }\n  }\n':
    types.RemoveMemberDocument,
  '\n  query LockedLegacyCount($orgId: uuid!) {\n    certificates_aggregate(where: { org_id: { _eq: $orgId }, recipient_name: { _is_null: true } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n':
    types.LockedLegacyCountDocument,
  '\n  mutation UnlockLegacyData($orgId: uuid!, $password: String!) {\n    unlock_legacy_data(org_id: $orgId, password: $password) {\n      unlocked_batches\n      unlocked_certificates\n    }\n  }\n':
    types.UnlockLegacyDataDocument,
  '\n  query FeatureFlags($key: String!) {\n    feature_flags(where: { key: { _eq: $key } }) {\n      org_id\n      enabled\n    }\n  }\n':
    types.FeatureFlagsDocument,
  '\n  query VerifyCertificate($certificateId: uuid!) {\n    verify_certificate(args: { certificate_id: $certificateId }) {\n      certificate_id\n      organisation_name\n      issuer_name\n      event_name\n      event_date\n      issued_at\n      recipient_name\n      rank\n      is_revoked\n    }\n  }\n':
    types.VerifyCertificateDocument,
  '\n  query VerifyPreviewUrl($certificateId: uuid!) {\n    get_verify_preview_url(certificate_id: $certificateId) {\n      url\n    }\n  }\n':
    types.VerifyPreviewUrlDocument,
}

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateBatch($object: batches_insert_input!) {\n    insert_batches_one(object: $object) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateBatch($object: batches_insert_input!) {\n    insert_batches_one(object: $object) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation StartBatchRender($batchId: uuid!) {\n    start_batch_render(batch_id: $batchId) {\n      job_id\n    }\n  }\n',
): (typeof documents)['\n  mutation StartBatchRender($batchId: uuid!) {\n    start_batch_render(batch_id: $batchId) {\n      job_id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Batch($id: uuid!, $limit: Int!, $offset: Int!) {\n    batches_by_pk(id: $id) {\n      id\n      org_id\n      status\n      recipient_count\n      has_rank\n      created_at\n      event {\n        id\n        name\n      }\n      creator {\n        full_name\n        email\n      }\n      rendered: certificates_aggregate(where: { render_status: { _eq: done } }) {\n        aggregate {\n          count\n        }\n      }\n      without_email: certificates_aggregate(where: { recipient_email: { _is_null: true } }) {\n        aggregate {\n          count\n        }\n      }\n      certificates(order_by: { created_at: asc }, limit: $limit, offset: $offset) {\n        id\n        recipient_name\n        recipient_email\n        rank\n        file_path\n        render_status\n        revoked_at\n        email_deliveries(order_by: { created_at: desc }, limit: 1) {\n          status\n          error\n          sent_at\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query Batch($id: uuid!, $limit: Int!, $offset: Int!) {\n    batches_by_pk(id: $id) {\n      id\n      org_id\n      status\n      recipient_count\n      has_rank\n      created_at\n      event {\n        id\n        name\n      }\n      creator {\n        full_name\n        email\n      }\n      rendered: certificates_aggregate(where: { render_status: { _eq: done } }) {\n        aggregate {\n          count\n        }\n      }\n      without_email: certificates_aggregate(where: { recipient_email: { _is_null: true } }) {\n        aggregate {\n          count\n        }\n      }\n      certificates(order_by: { created_at: asc }, limit: $limit, offset: $offset) {\n        id\n        recipient_name\n        recipient_email\n        rank\n        file_path\n        render_status\n        revoked_at\n        email_deliveries(order_by: { created_at: desc }, limit: 1) {\n          status\n          error\n          sent_at\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  subscription BatchJobs($batchId: uuid!) {\n    jobs(where: { ref_id: { _eq: $batchId } }, order_by: { created_at: desc }, limit: 10) {\n      id\n      kind\n      status\n      progress\n      total\n      error\n      result\n      created_at\n      finished_at\n    }\n  }\n',
): (typeof documents)['\n  subscription BatchJobs($batchId: uuid!) {\n    jobs(where: { ref_id: { _eq: $batchId } }, order_by: { created_at: desc }, limit: 10) {\n      id\n      kind\n      status\n      progress\n      total\n      error\n      result\n      created_at\n      finished_at\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ExportBatch($batchId: uuid!, $format: ExportFormat!) {\n    export_batch(batch_id: $batchId, format: $format) {\n      job_id\n    }\n  }\n',
): (typeof documents)['\n  mutation ExportBatch($batchId: uuid!, $format: ExportFormat!) {\n    export_batch(batch_id: $batchId, format: $format) {\n      job_id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query ExportUrl($jobId: uuid!) {\n    get_export_url(job_id: $jobId) {\n      url\n      expires_at\n    }\n  }\n',
): (typeof documents)['\n  query ExportUrl($jobId: uuid!) {\n    get_export_url(job_id: $jobId) {\n      url\n      expires_at\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation SendBatchEmails($batchId: uuid!) {\n    send_batch_emails(batch_id: $batchId) {\n      job_id\n    }\n  }\n',
): (typeof documents)['\n  mutation SendBatchEmails($batchId: uuid!) {\n    send_batch_emails(batch_id: $batchId) {\n      job_id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query DeliveryCounts($batchId: uuid!) {\n    sent: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: sent } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    failed: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: failed } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    queued: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: queued } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n',
): (typeof documents)['\n  query DeliveryCounts($batchId: uuid!) {\n    sent: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: sent } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    failed: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: failed } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n    queued: email_deliveries_aggregate(\n      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: queued } }\n    ) {\n      aggregate {\n        count\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CertificatesSearch(\n    $where: certificates_bool_exp!\n    $limit: Int!\n    $offset: Int!\n    $orderBy: [certificates_order_by!]\n  ) {\n    certificates(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {\n      id\n      recipient_name\n      recipient_email\n      rank\n      created_at\n      revoked_at\n      revoked_reason\n      render_status\n      batch {\n        id\n        event {\n          id\n          name\n        }\n      }\n    }\n    certificates_aggregate(where: $where) {\n      aggregate {\n        count\n      }\n    }\n  }\n',
): (typeof documents)['\n  query CertificatesSearch(\n    $where: certificates_bool_exp!\n    $limit: Int!\n    $offset: Int!\n    $orderBy: [certificates_order_by!]\n  ) {\n    certificates(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {\n      id\n      recipient_name\n      recipient_email\n      rank\n      created_at\n      revoked_at\n      revoked_reason\n      render_status\n      batch {\n        id\n        event {\n          id\n          name\n        }\n      }\n    }\n    certificates_aggregate(where: $where) {\n      aggregate {\n        count\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RevokeCertificate($id: uuid!, $revokedAt: timestamptz, $reason: String) {\n    update_certificates_by_pk(\n      pk_columns: { id: $id }\n      _set: { revoked_at: $revokedAt, revoked_reason: $reason }\n    ) {\n      id\n      revoked_at\n      revoked_reason\n    }\n  }\n',
): (typeof documents)['\n  mutation RevokeCertificate($id: uuid!, $revokedAt: timestamptz, $reason: String) {\n    update_certificates_by_pk(\n      pk_columns: { id: $id }\n      _set: { revoked_at: $revokedAt, revoked_reason: $reason }\n    ) {\n      id\n      revoked_at\n      revoked_reason\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Dashboard($orgId: uuid!) {\n    org_stats(where: { org_id: { _eq: $orgId } }) {\n      events_count\n      batches_count\n      certificates_count\n      last_batch_at\n    }\n    events(\n      where: { org_id: { _eq: $orgId }, deleted_at: { _is_null: true } }\n      order_by: { event_date: desc }\n    ) {\n      id\n      name\n      issuer_name\n      event_date\n      template {\n        id\n        image_path\n      }\n      batches_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query Dashboard($orgId: uuid!) {\n    org_stats(where: { org_id: { _eq: $orgId } }) {\n      events_count\n      batches_count\n      certificates_count\n      last_batch_at\n    }\n    events(\n      where: { org_id: { _eq: $orgId }, deleted_at: { _is_null: true } }\n      order_by: { event_date: desc }\n    ) {\n      id\n      name\n      issuer_name\n      event_date\n      template {\n        id\n        image_path\n      }\n      batches_aggregate {\n        aggregate {\n          count\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Event($id: uuid!) {\n    events_by_pk(id: $id) {\n      id\n      org_id\n      name\n      issuer_name\n      event_date\n      deleted_at\n      template {\n        id\n        image_path\n        image_width\n        image_height\n        fields {\n          field_key\n          x\n          y\n          width\n          height\n          font_family\n          font_weight\n          font_style\n          text_decoration\n          color\n        }\n      }\n      batches(order_by: { created_at: desc }) {\n        id\n        status\n        recipient_count\n        created_at\n        creator {\n          full_name\n          email\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query Event($id: uuid!) {\n    events_by_pk(id: $id) {\n      id\n      org_id\n      name\n      issuer_name\n      event_date\n      deleted_at\n      template {\n        id\n        image_path\n        image_width\n        image_height\n        fields {\n          field_key\n          x\n          y\n          width\n          height\n          font_family\n          font_weight\n          font_style\n          text_decoration\n          color\n        }\n      }\n      batches(order_by: { created_at: desc }) {\n        id\n        status\n        recipient_count\n        created_at\n        creator {\n          full_name\n          email\n        }\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateEvent($object: events_insert_input!) {\n    insert_events_one(object: $object) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateEvent($object: events_insert_input!) {\n    insert_events_one(object: $object) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateEvent($id: uuid!, $set: events_set_input!) {\n    update_events_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n      name\n      issuer_name\n      event_date\n      deleted_at\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateEvent($id: uuid!, $set: events_set_input!) {\n    update_events_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n      name\n      issuer_name\n      event_date\n      deleted_at\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Fonts {\n    fonts(order_by: { family: asc }) {\n      family\n      category\n      is_system\n      render_family\n    }\n  }\n',
): (typeof documents)['\n  query Fonts {\n    fonts(order_by: { family: asc }) {\n      family\n      category\n      is_system\n      render_family\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateTemplate($object: templates_insert_input!) {\n    insert_templates_one(object: $object) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateTemplate($object: templates_insert_input!) {\n    insert_templates_one(object: $object) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation ReplaceTemplate(\n    $id: uuid!\n    $set: templates_set_input!\n    $fields: [template_fields_insert_input!]!\n  ) {\n    delete_template_fields(where: { template_id: { _eq: $id } }) {\n      affected_rows\n    }\n    insert_template_fields(objects: $fields) {\n      affected_rows\n    }\n    update_templates_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation ReplaceTemplate(\n    $id: uuid!\n    $set: templates_set_input!\n    $fields: [template_fields_insert_input!]!\n  ) {\n    delete_template_fields(where: { template_id: { _eq: $id } }) {\n      affected_rows\n    }\n    insert_template_fields(objects: $fields) {\n      affected_rows\n    }\n    update_templates_by_pk(pk_columns: { id: $id }, _set: $set) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query EventOptions($orgId: uuid!) {\n    events(where: { org_id: { _eq: $orgId } }, order_by: { event_date: desc }) {\n      id\n      name\n    }\n  }\n',
): (typeof documents)['\n  query EventOptions($orgId: uuid!) {\n    events(where: { org_id: { _eq: $orgId } }, order_by: { event_date: desc }) {\n      id\n      name\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query MyMemberships($userId: uuid!) {\n    organization_members(where: { user_id: { _eq: $userId } }, order_by: { created_at: asc }) {\n      role\n      organization {\n        id\n        name\n        slug\n        show_name_on_verify\n      }\n    }\n  }\n',
): (typeof documents)['\n  query MyMemberships($userId: uuid!) {\n    organization_members(where: { user_id: { _eq: $userId } }, order_by: { created_at: asc }) {\n      role\n      organization {\n        id\n        name\n        slug\n        show_name_on_verify\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation BootstrapOrg($name: String!, $slug: String!) {\n    bootstrap_org(name: $name, slug: $slug) {\n      org_id\n    }\n  }\n',
): (typeof documents)['\n  mutation BootstrapOrg($name: String!, $slug: String!) {\n    bootstrap_org(name: $name, slug: $slug) {\n      org_id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation AcceptInvite($token: String!) {\n    accept_invite(token: $token) {\n      org_id\n    }\n  }\n',
): (typeof documents)['\n  mutation AcceptInvite($token: String!) {\n    accept_invite(token: $token) {\n      org_id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateOrganization($id: uuid!, $name: String!, $showNameOnVerify: Boolean!) {\n    update_organizations_by_pk(\n      pk_columns: { id: $id }\n      _set: { name: $name, show_name_on_verify: $showNameOnVerify }\n    ) {\n      id\n      name\n      show_name_on_verify\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateOrganization($id: uuid!, $name: String!, $showNameOnVerify: Boolean!) {\n    update_organizations_by_pk(\n      pk_columns: { id: $id }\n      _set: { name: $name, show_name_on_verify: $showNameOnVerify }\n    ) {\n      id\n      name\n      show_name_on_verify\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Members($orgId: uuid!) {\n    organization_members(where: { org_id: { _eq: $orgId } }, order_by: { created_at: asc }) {\n      user_id\n      role\n      created_at\n      profile {\n        full_name\n        email\n      }\n    }\n  }\n',
): (typeof documents)['\n  query Members($orgId: uuid!) {\n    organization_members(where: { org_id: { _eq: $orgId } }, order_by: { created_at: asc }) {\n      user_id\n      role\n      created_at\n      profile {\n        full_name\n        email\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query Invites($orgId: uuid!) {\n    organization_invites(\n      where: { org_id: { _eq: $orgId }, accepted_at: { _is_null: true } }\n      order_by: { created_at: desc }\n    ) {\n      id\n      email\n      role\n      expires_at\n      created_at\n    }\n  }\n',
): (typeof documents)['\n  query Invites($orgId: uuid!) {\n    organization_invites(\n      where: { org_id: { _eq: $orgId }, accepted_at: { _is_null: true } }\n      order_by: { created_at: desc }\n    ) {\n      id\n      email\n      role\n      expires_at\n      created_at\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation InviteMember($orgId: uuid!, $email: String!, $role: String!) {\n    invite_member(org_id: $orgId, email: $email, role: $role) {\n      invite_id\n    }\n  }\n',
): (typeof documents)['\n  mutation InviteMember($orgId: uuid!, $email: String!, $role: String!) {\n    invite_member(org_id: $orgId, email: $email, role: $role) {\n      invite_id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteInvite($id: uuid!) {\n    delete_organization_invites_by_pk(id: $id) {\n      id\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteInvite($id: uuid!) {\n    delete_organization_invites_by_pk(id: $id) {\n      id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateMemberRole($orgId: uuid!, $userId: uuid!, $role: org_role!) {\n    update_organization_members_by_pk(\n      pk_columns: { org_id: $orgId, user_id: $userId }\n      _set: { role: $role }\n    ) {\n      user_id\n      role\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateMemberRole($orgId: uuid!, $userId: uuid!, $role: org_role!) {\n    update_organization_members_by_pk(\n      pk_columns: { org_id: $orgId, user_id: $userId }\n      _set: { role: $role }\n    ) {\n      user_id\n      role\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RemoveMember($orgId: uuid!, $userId: uuid!) {\n    delete_organization_members_by_pk(org_id: $orgId, user_id: $userId) {\n      user_id\n    }\n  }\n',
): (typeof documents)['\n  mutation RemoveMember($orgId: uuid!, $userId: uuid!) {\n    delete_organization_members_by_pk(org_id: $orgId, user_id: $userId) {\n      user_id\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query LockedLegacyCount($orgId: uuid!) {\n    certificates_aggregate(where: { org_id: { _eq: $orgId }, recipient_name: { _is_null: true } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n',
): (typeof documents)['\n  query LockedLegacyCount($orgId: uuid!) {\n    certificates_aggregate(where: { org_id: { _eq: $orgId }, recipient_name: { _is_null: true } }) {\n      aggregate {\n        count\n      }\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UnlockLegacyData($orgId: uuid!, $password: String!) {\n    unlock_legacy_data(org_id: $orgId, password: $password) {\n      unlocked_batches\n      unlocked_certificates\n    }\n  }\n',
): (typeof documents)['\n  mutation UnlockLegacyData($orgId: uuid!, $password: String!) {\n    unlock_legacy_data(org_id: $orgId, password: $password) {\n      unlocked_batches\n      unlocked_certificates\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query FeatureFlags($key: String!) {\n    feature_flags(where: { key: { _eq: $key } }) {\n      org_id\n      enabled\n    }\n  }\n',
): (typeof documents)['\n  query FeatureFlags($key: String!) {\n    feature_flags(where: { key: { _eq: $key } }) {\n      org_id\n      enabled\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query VerifyCertificate($certificateId: uuid!) {\n    verify_certificate(args: { certificate_id: $certificateId }) {\n      certificate_id\n      organisation_name\n      issuer_name\n      event_name\n      event_date\n      issued_at\n      recipient_name\n      rank\n      is_revoked\n    }\n  }\n',
): (typeof documents)['\n  query VerifyCertificate($certificateId: uuid!) {\n    verify_certificate(args: { certificate_id: $certificateId }) {\n      certificate_id\n      organisation_name\n      issuer_name\n      event_name\n      event_date\n      issued_at\n      recipient_name\n      rank\n      is_revoked\n    }\n  }\n']
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query VerifyPreviewUrl($certificateId: uuid!) {\n    get_verify_preview_url(certificate_id: $certificateId) {\n      url\n    }\n  }\n',
): (typeof documents)['\n  query VerifyPreviewUrl($certificateId: uuid!) {\n    get_verify_preview_url(certificate_id: $certificateId) {\n      url\n    }\n  }\n']

export function graphql(source: string) {
  return (documents as any)[source] ?? {}
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never
