import { graphql } from '../generated'

export const VerifyCertificateQuery = graphql(`
  query VerifyCertificate($certificateId: uuid!) {
    verify_certificate(args: { certificate_id: $certificateId }) {
      certificate_id
      organisation_name
      issuer_name
      event_name
      event_date
      issued_at
      recipient_name
      rank
      is_revoked
    }
  }
`)
