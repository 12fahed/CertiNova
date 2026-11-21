import { Client, cacheExchange, fetchExchange, subscriptionExchange } from '@urql/vue'
import { createClient as createWsClient, type Client as WsClient } from 'graphql-ws'
import { accessToken, onAuthEvent } from '@/auth/session'
import { supabase } from './supabase'
import { env } from './env'

function authHeaders(token: string | undefined): Record<string, string> {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function createSocket(): WsClient {
  return createWsClient({
    url: env.hasuraWsUrl,
    lazy: true,
    // Read the session on each connect: Hasura closes the socket when the JWT expires.
    connectionParams: async () => {
      const { data } = await supabase.auth.getSession()
      return { headers: authHeaders(data.session?.access_token) }
    },
    shouldRetry: () => true,
  })
}

let socket = createSocket()

onAuthEvent((event) => {
  if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
    void socket.dispose()
    socket = createSocket()
  }
})

export const graphqlClient = new Client({
  url: env.hasuraHttpUrl,
  exchanges: [
    cacheExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription(request) {
        const input = { ...request, query: request.query ?? '' }
        return {
          subscribe(sink) {
            const unsubscribe = socket.subscribe(input, sink)
            return { unsubscribe }
          },
        }
      },
    }),
  ],
  fetchOptions: () => ({ headers: authHeaders(accessToken()) }),
  requestPolicy: 'cache-and-network',
})
