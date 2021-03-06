<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogAksi"
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
                    <v-text-field
                      v-model="editedItem.username"
                      label="Username"
                      :rules="[(v) => !!v || 'Username tidak boleh kosong']"
                      required
                      autocomplete="off"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.password"
                      label="Password"
                      :rules="[(v) => !!v || 'Password tidak boleh kosong']"
                      required
                      autocomplete="off"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="() => (showPassword = !showPassword)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="editedItem.role"
                      :items="['admin', 'petugas']"
                      label="Role"
                      :rules="[(v) => !!v || 'Role belum dipilih']"
                    ></v-select>
                  </v-col>
                </v-row>
                <!-- </v-form> -->
              </template>
            </DialogForm>
          </template>
        </Table>
      </v-col>
    </v-row>
    <DialogAksi
      :dialog="dialogDelete"
      :dialogLoading="dialogLoading"
      title="Anda yakin untuk menghapus data ini?"
      @submit="hapus"
      @closeDialog="closeDialog"
    />

    <v-snackbar
      :timeout="2000"
      v-model="response.show"
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
import DialogAksi from "@/components/DialogAksi.vue";
import { mapState, mapActions } from "vuex";

import UserModel from "@/models/user";

export default {
  components: {
    Table,
    DialogForm,
    DialogAksi,
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
        { text: "Username", value: "username" },
        { text: "Role", value: "role" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      showPassword: false,
    };
  },
  async created() {
    // cek jika data state telah diload

    if (!this.items.length) await this.getAll();

    await this.$store.commit("crudModule/initCrud", {
      model: UserModel,
      moduleName: "userModule",
    });

    this.loading = false;
  },
  computed: {
    ...mapState("userModule", ["items"]),
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
      return this.editedIndex === -1 ? "Tambah Data User" : "Edit Data User";
    },
  },
  methods: {
    ...mapActions("userModule", ["getAll"]),
    ...mapActions("crudModule", [
      "tambah",
      "edit",
      "hapus",
      "simpan",
      "showDialogAksi",
      "closeDialog",
    ]),
  },
};
</script>
