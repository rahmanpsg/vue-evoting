import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import vueaxios from "./plugins/axios";
import router from "./router";
import store from "./store";
import { Plugins } from "@capacitor/core";

const { SplashScreen } = Plugins;

Vue.config.productionTip = false;

new Vue({
  vuetify,
  vueaxios,
  router,
  store,
  render: (h) => h(App),
  mounted() {
    SplashScreen.hide();
    // StatusBar.setBackgroundColor({
    //   color: "#FF0000",
    // });
  },
}).$mount("#app");

// "@capacitor/android": "^2.0.0",
// "@capacitor/cli": "^2.0.0",
// "@capacitor/core": "^2.0.0",
// "@capacitor/status-bar": "^1.0.6",
