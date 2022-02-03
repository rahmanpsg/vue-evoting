export default {
  namespaced: true,
  state: () => ({
    form: null,
    model: null,
    editedIndex: -1,
    editedItem: {},
    dialog: false,
    dialogLoading: false,
    dialogDelete: false,
    response: { show: false, text: "", type: "error" },
    moduleName: null,
  }),
  getters: {
    getForm: (state) => {
      return state.form;
    },
  },
  mutations: {
    setForm(state, form) {
      state.form = form;
    },
    initCrud(state, { model, moduleName }) {
      console.log(`init crud ${moduleName}`);
      state.form = null;
      state.model = model;
      state.editedItem = new model({});
      state.moduleName = moduleName;
    },
    setResponse(state, { show, text, type }) {
      state.response.show = show;
      state.response.text = text;
      state.response.type = type;
    },
  },
  actions: {
    tambah({ state }) {
      state.editedItem = new state.model({});
      state.dialog = true;

      try {
        if (state.form) state.form.reset();
      } catch (error) {
        console.log(error);
      }
    },
    async edit({ state, rootState }, item) {
      try {
        state.editedIndex = rootState[state.moduleName].items.indexOf(item);

        state.editedItem = new state.model(item);

        if (state.form) state.form.validate();

        state.dialog = true;
      } catch (error) {
        console.log(error);
      }
    },

    async hapus({ state, dispatch }) {
      try {
        state.dialogLoading = true;

        const res = await dispatch(
          `${state.moduleName}/deleteItem`,
          {
            index: state.editedIndex,
            id: state.editedItem.id,
          },
          { root: true }
        );

        state.response.type = "success";
        state.response.text = res.data.message;

        if (res.status != 202) {
          state.response.type = "error";
          state.response.text = res.data.detail;
        }

        state.response.show = true;

        dispatch("closeDialog");
      } catch (error) {
        console.log(error);
      }
    },

    async simpan({ state, dispatch }) {
      try {
        await state.form.validate();

        if (!state.form.value) return;

        state.dialogLoading = true;

        let res;

        if (state.editedIndex > -1) {
          res = await dispatch(
            `${state.moduleName}/editItem`,
            {
              index: state.editedIndex,
              item: state.editedItem,
            },
            { root: true }
          );
        } else {
          res = await dispatch(
            `${state.moduleName}/addItem`,
            state.editedItem,
            {
              root: true,
            }
          );
        }

        if (res.status != 200 && res.status != 201 && res.status != 202) {
          state.response = { show: true, text: res.data.detail, type: "error" };

          state.dialogLoading = false;
          return;
        }

        state.response = {
          show: true,
          text: res.data.message,
          type: "success",
        };

        dispatch("closeDialog");
      } catch (error) {
        console.log(error);
      }
    },

    showDialogAksi({ state, rootState }, item) {
      state.editedIndex = rootState[state.moduleName].items.indexOf(item);
      state.editedItem = new state.model(item);

      state.dialogDelete = true;
    },

    closeDialog({ state }) {
      state.dialog = false;
      state.dialogLoading = false;
      state.dialogDelete = false;

      state.editedItem = new state.model({});
      state.editedIndex = -1;
    },
  },
};
