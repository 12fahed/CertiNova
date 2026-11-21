<script setup lang="ts">
import { useMutation } from '@urql/vue'
import { Button, Dialog, ErrorMessage, FormControl } from 'frappe-ui'
import { reactive, watch } from 'vue'
import { CreateEventMutation, UpdateEventMutation } from '@/graphql/operations/events'
import { unwrap } from '@/lib/errors'
import { useTask } from '@/lib/useTask'
import { useCurrentOrg } from '@/org/currentOrg'

export interface EventFields {
  id: string
  name: string
  issuer_name: string
  event_date: string
}

const props = defineProps<{ event?: EventFields }>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ saved: [id: string] }>()

const { orgId } = useCurrentOrg()
const createEvent = useMutation(CreateEventMutation)
const updateEvent = useMutation(UpdateEventMutation)
const form = reactive({ name: '', issuer_name: '', event_date: '' })

watch(open, (isOpen) => {
  if (!isOpen) return
  form.name = props.event?.name ?? ''
  form.issuer_name = props.event?.issuer_name ?? ''
  form.event_date = props.event?.event_date ?? new Date().toISOString().slice(0, 10)
  save.error = undefined
})

const save = useTask(async () => {
  const fields = {
    name: form.name.trim(),
    issuer_name: form.issuer_name.trim(),
    event_date: form.event_date,
  }
  let id: string
  if (props.event) {
    unwrap(await updateEvent.executeMutation({ id: props.event.id, set: fields }))
    id = props.event.id
  } else {
    const data = unwrap(
      await createEvent.executeMutation({ object: { ...fields, org_id: orgId.value } }),
    )
    if (!data.insert_events_one) throw new Error('The event was not saved.')
    id = data.insert_events_one.id
  }
  open.value = false
  emit('saved', id)
})
</script>

<template>
  <Dialog v-model:open="open" :title="event ? 'Edit event' : 'New event'" size="md">
    <form id="event-form" class="flex flex-col gap-4" @submit.prevent="save.run()">
      <FormControl
        v-model="form.name"
        variant="outline"
        label="Event name"
        required
        minlength="2"
        maxlength="200"
      />
      <FormControl
        v-model="form.issuer_name"
        variant="outline"
        label="Issued by"
        description="The person or body that signs the certificates."
        required
        minlength="2"
        maxlength="100"
      />
      <FormControl
        v-model="form.event_date"
        variant="outline"
        label="Event date"
        type="date"
        required
      />
      <ErrorMessage :message="save.error" />
    </form>
    <template #actions>
      <div class="flex justify-end gap-2">
        <Button label="Cancel" @click="open = false" />
        <Button
          type="submit"
          form="event-form"
          variant="solid"
          theme="blue"
          :label="event ? 'Save' : 'Create event'"
          :loading="save.loading"
        />
      </div>
    </template>
  </Dialog>
</template>
