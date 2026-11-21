import { graphql } from '../generated'

export const CreateBatchMutation = graphql(`
  mutation CreateBatch($object: batches_insert_input!) {
    insert_batches_one(object: $object) {
      id
    }
  }
`)

export const StartBatchRenderMutation = graphql(`
  mutation StartBatchRender($batchId: uuid!) {
    start_batch_render(batch_id: $batchId) {
      job_id
    }
  }
`)

export const BatchQuery = graphql(`
  query Batch($id: uuid!, $limit: Int!, $offset: Int!) {
    batches_by_pk(id: $id) {
      id
      org_id
      status
      recipient_count
      has_rank
      created_at
      event {
        id
        name
      }
      creator {
        full_name
        email
      }
      rendered: certificates_aggregate(where: { render_status: { _eq: done } }) {
        aggregate {
          count
        }
      }
      without_email: certificates_aggregate(where: { recipient_email: { _is_null: true } }) {
        aggregate {
          count
        }
      }
      certificates(order_by: { created_at: asc }, limit: $limit, offset: $offset) {
        id
        recipient_name
        recipient_email
        rank
        file_path
        render_status
        revoked_at
        email_deliveries(order_by: { created_at: desc }, limit: 1) {
          status
          error
          sent_at
        }
      }
    }
  }
`)

export const BatchJobsSubscription = graphql(`
  subscription BatchJobs($batchId: uuid!) {
    jobs(where: { ref_id: { _eq: $batchId } }, order_by: { created_at: desc }, limit: 10) {
      id
      kind
      status
      progress
      total
      error
      result
      created_at
      finished_at
    }
  }
`)

export const ExportBatchMutation = graphql(`
  mutation ExportBatch($batchId: uuid!, $format: ExportFormat!) {
    export_batch(batch_id: $batchId, format: $format) {
      job_id
    }
  }
`)

export const ExportUrlQuery = graphql(`
  query ExportUrl($jobId: uuid!) {
    get_export_url(job_id: $jobId) {
      url
      expires_at
    }
  }
`)

export const SendBatchEmailsMutation = graphql(`
  mutation SendBatchEmails($batchId: uuid!) {
    send_batch_emails(batch_id: $batchId) {
      job_id
    }
  }
`)

export const DeliveryCountsQuery = graphql(`
  query DeliveryCounts($batchId: uuid!) {
    sent: email_deliveries_aggregate(
      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: sent } }
    ) {
      aggregate {
        count
      }
    }
    failed: email_deliveries_aggregate(
      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: failed } }
    ) {
      aggregate {
        count
      }
    }
    queued: email_deliveries_aggregate(
      where: { certificate: { batch_id: { _eq: $batchId } }, status: { _eq: queued } }
    ) {
      aggregate {
        count
      }
    }
  }
`)

export const CertificatesSearchQuery = graphql(`
  query CertificatesSearch(
    $where: certificates_bool_exp!
    $limit: Int!
    $offset: Int!
    $orderBy: [certificates_order_by!]
  ) {
    certificates(where: $where, limit: $limit, offset: $offset, order_by: $orderBy) {
      id
      recipient_name
      recipient_email
      rank
      created_at
      revoked_at
      revoked_reason
      render_status
      batch {
        id
        event {
          id
          name
        }
      }
    }
    certificates_aggregate(where: $where) {
      aggregate {
        count
      }
    }
  }
`)

export const RevokeCertificateMutation = graphql(`
  mutation RevokeCertificate($id: uuid!, $revokedAt: timestamptz, $reason: String) {
    update_certificates_by_pk(
      pk_columns: { id: $id }
      _set: { revoked_at: $revokedAt, revoked_reason: $reason }
    ) {
      id
      revoked_at
      revoked_reason
    }
  }
`)
