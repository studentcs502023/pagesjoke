// main.js
import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, Dialog, Notify, Screen, LocalStorage, SessionStorage } from 'quasar'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import './style.css'

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
    Screen,
    LocalStorage,
    SessionStorage
  },
})

myApp.mount('#app')
