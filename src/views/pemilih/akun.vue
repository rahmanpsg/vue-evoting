<template>
  <v-container>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title><h3>Pengaturan Akun</h3> </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="submit">
          <v-icon>{{
            edit ? "mdi-content-save-all" : "mdi-account-edit"
          }}</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation :disabled="!edit">
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
              <v-textarea
                v-model="editedItem.alamat"
                label="Alamat"
                :rules="[(v) => !!v || 'Alamat tidak boleh kosong']"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>

        <v-checkbox
          v-model="loginFaceRecognition"
          label="Aktifkan Login Dengan Face Recognition"
          @click="toFaceRecognition"
        ></v-checkbox>
      </v-card-text>
      <v-snackbar v-model="snackbar" top>{{ snackbarText }}</v-snackbar>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      edit: false,
      valid: true,
      showPassword: false,
      loginFaceRecognition: false,
      nik: null,
      password: null,
      alamat: null,
      snackbar: false,
      snackbarText: null,
    };
  },
  async created() {
    // await this.$store.dispatch("pemilihModule/getItem", {
    //   id: this.id,
    // });
    if (this.data.nik == null) await this.getItem({ id: this.id });
  },
  computed: {
    ...mapState("authModule", ["id"]),
    ...mapState("pemilihModule", ["data"]),
    editedItem() {
      return {
        id: this.id,
        nik: this.data.nik,
        nama: this.data.nama,
        username: this.data.username,
        password: this.data.password,
        alamat: this.data.alamat,
      };
    },
  },
  methods: {
    ...mapActions("pemilihModule", ["getItem", "editItem"]),
    async submit() {
      if (!this.edit) {
        this.edit = true;
        return;
      }

      const res = await this.editItem({ index: -1, item: this.editedItem });

      this.snackbar = true;

      if (res.status == 202) {
        this.snackbarText = "Data berhasil disimpan";
        this.edit = false;
      } else {
        this.snackbarText = res.data.detail;
      }
    },
    toFaceRecognition() {
      this.$router.push("/pemilih/facerecognition");
    },
  },
};
</script>
