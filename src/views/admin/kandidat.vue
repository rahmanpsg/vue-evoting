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
              :formValid="valid"
              @closeDialog="closeDialog"
              @simpan="simpan"
            >
              <template v-slot:form>
                <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
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
                <!-- </v-form> -->
              </template>
            </DialogForm>

            <DialogHapus
              :dialog="dialogDelete"
              :dialogLoading="dialogLoading"
              title="Anda yakin untuk menghapus data ini?"
              @hapus="hapus"
              @closeDialog="closeDialog"
            />
          </template>
        </Table>
      </v-col>
    </v-row>
    <v-snackbar
      :timeout="2000"
      v-model="response.show"
      absolute
      centered
      text
      outlined
      :color="response.type"
    >
      <v-alert :type="response.type" text shaped prominent>
        <strong v-text="response.text"></strong>
      </v-alert>
    </v-snackbar>
  </v-container>
</template>

<script>
import Table from "@/components/Table.vue";
import DialogForm from "@/components/DialogForm.vue";
import DialogHapus from "@/components/DialogHapus.vue";
import { mapState, mapActions } from "vuex";

import KandidatModel from "@/models/kandidat";

export default {
  components: {
    Table,
    DialogForm,
    DialogHapus,
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
    };
  },
  async created() {
    // cek jika data state telah diload

    if (!this.items.length) await this.getAll();

    await this.$store.commit("crudModule/initCrud", {
      model: KandidatModel,
      items: this.items,
      moduleName: "kandidatModule",
    });

    this.loading = false;
  },
  computed: {
    ...mapState("kandidatModule", ["items"]),
    ...mapState("crudModule", [
      "valid",
      "dialog",
      "dialogLoading",
      "dialogDelete",
      "editedIndex",
      "editedItem",
      "response",
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Kandidat"
        : "Edit Data Kandidat";
    },
  },
  methods: {
    ...mapActions("kandidatModule", ["getAll"]),
    ...mapActions("crudModule", [
      "tambah",
      "edit",
      "hapus",
      "simpan",
      "showDialogHapus",
      "closeDialog",
    ]),
  },
};
</script>
