import { reactive, ref } from 'vue'
import { errorMessage } from './errors'

/** Runs one async task at a time and keeps its loading state and error message. */
export function useTask<Args extends unknown[], Result>(task: (...args: Args) => Promise<Result>) {
  const loading = ref(false)
  const error = ref<string>()

  async function run(...args: Args): Promise<Result | undefined> {
    if (loading.value) return undefined
    loading.value = true
    error.value = undefined
    try {
      return await task(...args)
    } catch (caught) {
      error.value = errorMessage(caught)
      return undefined
    } finally {
      loading.value = false
    }
  }

  return reactive({ run, loading, error })
}
