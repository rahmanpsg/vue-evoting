// import kandidatModel from "@/models/kandidat";
import axios from "axios";
export default {
  namespaced: true,
  state: () => ({
    kandidats: [],
  }),
  mutations: {
    setKandidats(state, kandidats) {
      state.kandidats = kandidats;
    },
  },
  actions: {
    async getAll({ commit }) {
      try {
        const { data } = await axios.get(`kandidat/`);
        commit("setKandidats", data);
      } catch (error) {
        return error.response;
      }
    },
    async getListKandidat({ commit }) {
      try {
        const { data } = await axios.get(`kandidat?select=list`);
        commit("setKandidats", data);
      } catch (error) {
        return error.response;
      }
    },
    async addKandidat({ commit, state }, kandidat) {
      try {
        const res = await axios.post("kandidat/", kandidat.toFormData());

        if (res.status == 201) {
          const newKandidat = res.data.kandidat;
          commit("setKandidats", [...state.kandidats, newKandidat]);
        }

        return res;
      } catch (error) {
        return error.response;
      }
    },
    async editKandidat({ state }, { index, kandidat }) {
      try {
        const res = await axios.put(
          `kandidat/${kandidat.id}`,
          kandidat.toFormData()
        );

        if (res.status == 202) Object.assign(state.kandidats[index], kandidat);
        return res;
      } catch (error) {
        return error.response;
      }
    },
    async deleteKandidat({ state }, { index, id }) {
      try {
        const res = await axios.delete(`kandidat/${id}`);

        if (res.status == 202) state.kandidats.splice(index, 1);

        return res;
      } catch (error) {
        return error.response;
      }
    },
  },
};
