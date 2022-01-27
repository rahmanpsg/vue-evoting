// import itemModel from "@/models/item";
import axios from "axios";

export default {
  namespaced: true,
  state: () => ({
    items: [],
    selectedIndex: null,
    path: "daftarVote",
  }),
  mutations: {
    setItems(state, items) {
      state.items = items;
    },
    setListData(state, { index, jenis, items }) {
      if (jenis == "kandidat") state.items[index].list_kandidat = items;
      if (jenis == "pemilih") state.items[index].list_pemilih = items;
    },
    setSelectedIndex(state, index) {
      state.selectedIndex = index;
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
    async getByPemilih({ commit, state, rootState }) {
      try {
        const { data } = await axios.get(
          `${state.path}/pemilih/${rootState.authModule.id}`
        );
        commit("setItems", data);
      } catch (error) {
        return error.response;
      }
    },
    async addItem({ commit, state }, item) {
      try {
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
    async editItem({ state }, { index, item }) {
      try {
        const res = await axios.put(`${state.path}/${item.id}`, item);

        if (item.file != undefined) {
          item.cache = new Date().getTime();
        }

        if (res.status == 202) {
          item.file = null;
          Object.assign(state.items[index], item);
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
    async simpanDataList({ state, commit }, { id, index, items, jenis }) {
      try {
        const res = await axios.post(
          `${state.path}/list/${jenis}/${id}`,
          items
        );
        if (res.status == 202) {
          commit("setListData", { index, jenis, items: items });
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async getDataList({ state, commit }, { id, index, jenis }) {
      try {
        const res = await axios.get(`${state.path}/${jenis}/${id}`);

        if (res.status == 200) {
          commit("setListData", { index, jenis, items: res.data });
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async getDataPerolehanSuara(_, { id }) {
      try {
        const res = await axios.get(`total/perolehansuara/${id}`);

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async simpanVote(_, { idDaftarVote, idPemilih, voteNomor }) {
      try {
        const res = await axios.post(
          `vote/${idDaftarVote}/${idPemilih}?vote_nomor=${voteNomor}`
        );

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
