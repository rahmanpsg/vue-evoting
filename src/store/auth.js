import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    login: false,
    id: null,
    username: null,
    nama: null,
    role: null,
    token: null,
  }),
  mutations: {
    isLogin: (state, login) => {
      state.login = login;

      if (!login) state.token = null;
    },
    setData: (state, { token, user }) => {
      try {
        state.username = user.username;
        state.nama = user.nama;
        state.role = user.role;
        state.token = token.access_token;
        axios.defaults.headers[
          "Authorization"
        ] = `Bearer ${token.access_token}`;

        if (user.role == "pemilih") {
          state.id = user.id;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  actions: {
    async login(_, { username, password }) {
      try {
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        const res = await axios.post("login/", formData);

        // console.log(res);

        return res;
      } catch (error) {
        return error.response;
      }
    },
    logout({ commit }) {
      commit("isLogin", false);
      commit("userModule/reset", {}, { root: true });
      commit("kandidatModule/reset", {}, { root: true });
      commit("pemilihModule/reset", {}, { root: true });
      commit("daftarVoteModule/reset", {}, { root: true });
    },
  },
};
