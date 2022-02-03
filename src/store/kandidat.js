// import itemModel from "@/models/item";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    items: [],
    path: "kandidat",
  }),
  mutations: {
    setItems(state, items) {
      state.items = items;
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
    async getKandidat({ state }, id) {
      try {
        const res = await axios.get(`${state.path}/${id}`);

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async addItem({ commit, state }, item) {
      try {
        const res = await axios.post(`${state.path}/`, item.toFormData());

        if (res.status == 201) {
          const newItem = res.data.item;
          commit("setItems", [...state.items, newItem]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editItem({ state }, { index, item }) {
      try {
        const res = await axios.put(
          `${state.path}/${item.id}`,
          item.toFormData()
        );

        if (item.file != undefined) {
          item.cache = new Date().getTime();
        }

        if (res.status == 202) {
          item.file = null;
          Object.assign(state.items[index], res.data.item);
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
  },
};
