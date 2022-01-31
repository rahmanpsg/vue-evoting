// import itemModel from "@/models/item";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    items: [],
    path: "pemilih",
    data: {
      nik: null,
      nama: null,
      username: null,
      password: null,
      alamat: null,
    },
  }),
  getters: {
    pemilihVerif(state) {
      return state.items.filter((item) => item.status);
    },
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
    setData(state, data) {
      state.data = data;
    },
    reset(state) {
      state.items = [];
    },
  },
  actions: {
    async getAll({ commit, state }) {
      try {
        const { data } = await axios.get(`${state.path}/`);
        commit("setItems", data);
      } catch (error) {
        return error.response;
      }
    },
    async getItem({ commit, state, rootState }, { id }) {
      try {
        const res = await axios.get(`${state.path}/${id}`);

        if (res.status == 200) {
          const { nik, password, alamat } = res.data;

          commit("setData", {
            nik,
            password,
            alamat,
            nama: rootState.authModule.nama,
            username: rootState.authModule.username,
          });
        }
      } catch (error) {
        return error.response;
      }
    },

    async addItem({ commit, state }, item) {
      try {
        item.status = true;
        const res = await axios.post(`${state.path}/`, item);

        if (res.status == 201) {
          const newItem = res.data.item;
          commit("setItems", [...state.items, newItem]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editItem({ commit, state }, { index, item }) {
      try {
        const res = await axios.put(`${state.path}/${item.id}`, item);

        if (res.status == 202 && index != -1) {
          Object.assign(state.items[index], item);
        }

        if (res.status == 202 && index == -1) {
          commit("setData", item);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deleteItem({ state }, { index, id }) {
      try {
        const res = await axios.delete(`${state.path}/${id}`);

        if (res.status == 202) state.items.splice(index, 1);

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async verifikasi({ state }, { id, status }) {
      try {
        const res = await axios.post(`${state.path}/verifikasi/${id}`, {
          status,
        });

        if (res.status == 202) {
          const index = state.items.findIndex((item) => item.id == id);

          Object.assign(state.items[index], { status });
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
