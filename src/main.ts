import { createApp } from "vue";
import App from "./App.vue";
const myApp = createApp(App);

import { Quasar } from "quasar";
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

myApp.mount("#app");
