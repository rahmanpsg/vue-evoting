import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    login: false,
    username: null,
    nama: null,
    role: null,
    token: null,
  }),
  mutations: {
    isLogin: (state, login) => {
      state.login = login;
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

        // if (data.role == "pegawai") {
        //   state.pegawai = new pegawaiModel(data);
        // } else if (data.role == "verifikator") {
        //   state.verifikator = new verifikatorModel({
        //     ...data,
        //     pegawai: new pegawaiModel(data),
        //   });
        // }
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
      this.$router.push("/");
      localStorage.clear();
    },
  },
};
