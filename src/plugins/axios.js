import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import store from "@/store";

if (process.env.NODE_ENV == "development")
  axios.defaults.baseURL = `http://192.168.43.239:4000/`;
axios.defaults.headers[
  "Authorization"
] = `Bearer ${store.state.authModule.token}`;

Vue.use(VueAxios, axios);

export default new VueAxios();
