import { createApp } from 'vue'
import urql from '@urql/vue'
import App from './App.vue'
import { graphqlClient } from './lib/graphql'
import { router } from './router'
import './style.css'

createApp(App).use(router).use(urql, graphqlClient).mount('#app')
