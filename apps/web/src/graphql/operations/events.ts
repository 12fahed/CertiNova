import { graphql } from '../generated'

export const DashboardQuery = graphql(`
  query Dashboard($orgId: uuid!) {
    org_stats(where: { org_id: { _eq: $orgId } }) {
      events_count
      batches_count
      certificates_count
      last_batch_at
    }
    events(
      where: { org_id: { _eq: $orgId }, deleted_at: { _is_null: true } }
      order_by: { event_date: desc }
    ) {
      id
      name
      issuer_name
      event_date
      template {
        id
      }
      batches_aggregate {
        aggregate {
          count
        }
      }
    }
  }
`)

export const EventQuery = graphql(`
  query Event($id: uuid!) {
    events_by_pk(id: $id) {
      id
      org_id
      name
      issuer_name
      event_date
      deleted_at
      template {
        id
        image_path
        image_width
        image_height
        fields {
          field_key
          x
          y
          width
          height
          font_family
          font_weight
          font_style
          text_decoration
          color
        }
      }
      batches(order_by: { created_at: desc }) {
        id
        status
        recipient_count
        created_at
        creator {
          full_name
          email
        }
      }
    }
  }
`)

export const CreateEventMutation = graphql(`
  mutation CreateEvent($object: events_insert_input!) {
    insert_events_one(object: $object) {
      id
    }
  }
`)

export const UpdateEventMutation = graphql(`
  mutation UpdateEvent($id: uuid!, $set: events_set_input!) {
    update_events_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
      name
      issuer_name
      event_date
      deleted_at
    }
  }
`)

export const FontsQuery = graphql(`
  query Fonts {
    fonts(order_by: { family: asc }) {
      family
      category
      is_system
      render_family
    }
  }
`)

export const CreateTemplateMutation = graphql(`
  mutation CreateTemplate($object: templates_insert_input!) {
    insert_templates_one(object: $object) {
      id
    }
  }
`)

export const ReplaceTemplateMutation = graphql(`
  mutation ReplaceTemplate(
    $id: uuid!
    $set: templates_set_input!
    $fields: [template_fields_insert_input!]!
  ) {
    delete_template_fields(where: { template_id: { _eq: $id } }) {
      affected_rows
    }
    insert_template_fields(objects: $fields) {
      affected_rows
    }
    update_templates_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`)

export const EventOptionsQuery = graphql(`
  query EventOptions($orgId: uuid!) {
    events(where: { org_id: { _eq: $orgId } }, order_by: { event_date: desc }) {
      id
      name
    }
  }
`)
