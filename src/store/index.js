import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import SecureLS from "secure-ls";
const ls = new SecureLS({ isCompression: false });

import crudModule from "./crud";
import authModule from "./auth";
import userModule from "./user";
import kandidatModule from "./kandidat";
import pemilihModule from "./pemilih";
import daftarVoteModule from "./daftarVote";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    crudModule,
    authModule,
    userModule,
    kandidatModule,
    pemilihModule,
    daftarVoteModule,
  },
  plugins: [
    createPersistedState({
      paths: ["authModule"],
      storage: {
        getItem: (key) => ls.get(key),
        setItem: (key, value) => ls.set(key, value),
        removeItem: (key) => ls.remove(key),
      },
    }),
  ],
});
