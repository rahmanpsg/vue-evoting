import axios from "axios";
import PemilihModel from "../models/pemilih";

export default {
  namespaced: true,
  state: () => ({
    items: [],
    path: "pemilih",
    data: new PemilihModel({}),
  }),
  getters: {
    pemilihVerif(state) {
      return state.items.filter((item) => item.status);
    },
    faceRecognition(state) {
      return state.data.face_recognition;
    },
  },
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
    setData(state, data) {
      state.data = new PemilihModel(data);
    },
    reset(state) {
      state.items = [];
      state.data = new PemilihModel({});
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
    async getItem({ commit, state }, { id }) {
      try {
        const res = await axios.get(`${state.path}/${id}`);

        if (res.status == 200) {
          commit("setData", res.data);
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
