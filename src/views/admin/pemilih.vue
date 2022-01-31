<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogAksi"
          :headers="headers"
          :items="itemsVerif"
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
                      v-model="editedItem.nik"
                      label="NIK"
                      :rules="[
                        (v) => !!v || 'NIK tidak boleh kosong',
                        (v) => (v && v.length == 16) || 'NIK harus 16 angka',
                      ]"
                      type="number"
                      counter
                      maxlength="16"
                      required
                    ></v-text-field>
                  </v-col>

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
                      autocomplete="false"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.password"
                      label="Password"
                      :rules="[(v) => !!v || 'Password tidak boleh kosong']"
                      required
                      autocomplete="false"
                      :type="showPassword ? 'text' : 'password'"
                      :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                      @click:append="() => (showPassword = !showPassword)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="editedItem.alamat"
                      label="Alamat"
                      :rules="[(v) => !!v || 'Alamat tidak boleh kosong']"
                    ></v-textarea>
                  </v-col>
                </v-row>
                <!-- </v-form> -->
              </template>
            </DialogForm>
          </template>
        </Table>
      </v-col>

      <v-col cols="12">
        <Table
          @verif="verif"
          :headers="headersVerif"
          :items="itemsNotVerif"
          itemKey="id"
          sortBy="id"
          :loading="loading"
          :showBtnTambah="false"
        >
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

    <DialogAksi
      :dialog="dialogVerif"
      :dialogLoading="dialogVerifLoading"
      :title="dialogVerifTitle"
      @submit="verifSubmit"
      @closeDialog="dialogVerif = false"
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

import PemilihModel from "@/models/pemilih";

export default {
  components: {
    Table,
    DialogForm,
    DialogAksi,
  },
  data() {
    const headers = [
      {
        text: "#",
        align: "start",
        sortable: false,
        value: "index",
      },
      { text: "Nama", value: "nama" },
      { text: "NIK", value: "nik" },
      { text: "Username", value: "username" },
      { text: "Alamat", value: "alamat" },
      { text: "Status", value: "status" },
    ];
    return {
      loading: true,
      headers: [...headers, { text: "Aksi", value: "aksi", sortable: false }],
      headersVerif: [
        ...headers,
        { text: "Verifikasi", value: "verif", sortable: false },
      ],
      showPassword: false,
      dialogVerif: false,
      dialogVerifLoading: false,
      dialogVerifTitle: null,
      verifData: { id: null, status: null },
    };
  },
  async created() {
    // cek jika data state telah diload

    if (!this.items.length) await this.getAll();

    await this.$store.commit("crudModule/initCrud", {
      model: PemilihModel,
      items: this.items,
      moduleName: "pemilihModule",
    });

    this.loading = false;
  },
  computed: {
    ...mapState("pemilihModule", ["items"]),
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
        ? "Tambah Data Pemilih"
        : "Edit Data Pemilih";
    },
    itemsVerif() {
      return this.items.filter((item) => item.status != null);
    },
    itemsNotVerif() {
      return this.items.filter((item) => {
        return item.status == null;
      });
    },
  },
  methods: {
    ...mapActions("pemilihModule", ["getAll", "verifikasi"]),
    ...mapActions("crudModule", [
      "tambah",
      "edit",
      "hapus",
      "simpan",
      "showDialogAksi",
      "closeDialog",
    ]),
    verif(aksi, item) {
      this.dialogVerifTitle = `${item.nama} akan di${aksi}`;
      this.dialogVerif = true;

      this.verifData = { id: item.id, status: aksi == "terima" };
    },
    async verifSubmit() {
      this.dialogVerifLoading = true;

      const res = await this.verifikasi(this.verifData);

      const response = { show: true, text: null, type: "error" };

      if (res.status == 202) {
        response.text = res.data.message;
        response.type = "success";
      } else {
        response.text = res.data.detail;
      }

      this.dialogVerifLoading = false;
      this.dialogVerif = false;
      this.$store.commit("crudModule/setResponse", response);
    },
  },
};
</script>
