<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogHapus"
          :headers="headers"
          :items="items"
          itemKey="id"
          sortBy="id"
          :loading="loading"
          :dialogDelete="dialogDelete"
        >
          <template v-slot:modal>
            <DialogForm
              :dialog="dialog"
              :loading="dialogLoading"
              :formTitle="formTitle"
              @closeDialog="closeDialog"
              @simpan="simpan"
            >
              <template v-slot:form>
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.nama"
                        label="Nama"
                        :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
                        required
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                      <v-file-input
                        v-model="editedItem.file"
                        label="Foto"
                        prepend-icon="mdi-camera"
                        accept="image/png, image/jpeg, image/bmp"
                        :rules="[
                          (v) =>
                            editedIndex !== -1 ||
                            !!v ||
                            'Foto tidak boleh kosong',
                        ]"
                        :required="editedIndex !== -1"
                      ></v-file-input>
                      <template v-if="editedIndex !== -1">
                        <div class="ml-6 mt-n4 caption">
                          <v-icon small class="">mdi-information</v-icon>
                          Kosongkan Foto Jika Tidak Ingin Diubah
                        </div>
                      </template>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-textarea
                        v-model="editedItem.keterangan"
                        label="Keterangan"
                        :rules="[(v) => !!v || 'Keterangan tidak boleh kosong']"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </template>
            </DialogForm>

            <DialogCustom
              :dialog="dialogDelete"
              title="Anda yakin untuk menghapus data ini?"
              @event="hapus"
              @closeDialog="closeDialog"
            />
          </template>
        </Table>

        <v-snackbar
          :timeout="2000"
          :value="response.show"
          absolute
          center
          text
          outlined
          :color="response.type"
        >
          <v-alert :type="response.type" text shaped prominent>
            <strong v-text="response.text"></strong>
          </v-alert>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Table from "@/components/Table.vue";
import DialogForm from "@/components/DialogForm.vue";
import DialogCustom from "@/components/DialogCustom.vue";
import { mapState, mapActions } from "vuex";

import KandidatModel from "@/models/kandidat";

export default {
  components: {
    Table,
    DialogForm,
    DialogCustom,
  },
  data() {
    return {
      loading: true,
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Nama", value: "nama" },
        { text: "Foto", value: "foto", sortable: false },
        { text: "Keterangan", value: "keterangan", sortable: false },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      dialog: false,
      dialogLoading: false,
      dialogDelete: false,
      editedIndex: -1,
      editedItem: new KandidatModel({}),
      valid: true,
      response: { show: false, text: "", type: "error" },
      alertImage: false,
    };
  },
  async created() {
    await this.getAll();

    this.loading = false;
  },
  computed: {
    ...mapState("kandidatModule", {
      items: "kandidats",
    }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Kandidat"
        : "Edit Data Kandidat";
    },
  },
  methods: {
    ...mapActions("kandidatModule", [
      "getAll",
      "addKandidat",
      "editKandidat",
      "deleteKandidat",
    ]),
    tambah() {
      this.editedItem = new KandidatModel({});

      this.dialog = true;

      this.$nextTick(() => {
        this.$refs.form.reset();
      });
    },
    async edit(item) {
      try {
        try {
          this.editedIndex = this.items.indexOf(item);
          this.editedItem = new KandidatModel(item);
        } catch (error) {
          console.log(error);
        }

        if (this.$refs.form) await this.$refs.form.validate();

        this.dialog = true;
      } catch (error) {
        console.log(error);
      }
    },
    showDialogHapus(item) {
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = new KandidatModel(item);

      this.dialogDelete = true;
    },
    async hapus() {
      const res = await this.deleteKandidat({
        index: this.editedIndex,
        id: this.editedItem.id,
      });

      this.response.type = "success";
      this.response.text = res.data.message;

      if (res.status != 202) {
        this.response.type = "error";
        this.response.text = res.data.detail;
      }

      this.response.show = true;

      this.closeDialog();
    },
    async simpan() {
      await this.$refs.form.validate();

      if (!this.valid) return;

      this.dialogLoading = true;

      let res;
      if (this.editedIndex > -1) {
        res = await this.editKandidat({
          index: this.editedIndex,
          kandidat: this.editedItem,
        });
      } else {
        res = await this.addKandidat(this.editedItem);
      }

      this.closeDialog();

      if (res.status != 200 && res.status != 201 && res.status != 202) {
        this.response = { show: true, text: res.data.detail, type: "error" };
        return;
      }

      this.response = { show: true, text: res.data.message, type: "success" };
    },
    closeDialog() {
      this.dialog = false;
      this.dialogLoading = false;
      this.dialogDelete = false;

      this.$nextTick(() => {
        this.editedItem = new KandidatModel({});
        this.editedIndex = -1;
      });
    },
  },
};
</script>
