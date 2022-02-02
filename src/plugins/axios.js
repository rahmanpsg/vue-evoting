import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "@/store";

axios.defaults.baseURL =
  process.env.NODE_ENV == "development"
    ? process.env.VUE_APP_BASE_URL
    : process.env.VUE_APP_SERVER_URL;

axios.defaults.headers[
  "Authorization"
] = `Bearer ${store.state.authModule.token}`;

Vue.use(VueAxios, axios);

export default new VueAxios();
