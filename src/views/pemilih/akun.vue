<template>
  <v-container>
    <v-card>
      <v-toolbar color="primary" dark>
        <v-toolbar-title><h3>Pengaturan Akun</h3> </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon @click="edit = true">
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
                v-model="nama"
                label="Nama"
                :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
                required
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="username"
                label="Username"
                :rules="[(v) => !!v || 'Username tidak boleh kosong']"
                required
                autocomplete="off"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="12">
              <v-text-field
                v-model="password"
                label="Password"
                :rules="[(v) => !!v || 'Password tidak boleh kosong']"
                required
                autocomplete="off"
                :type="showPassword ? 'text' : 'password'"
                :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append="() => (showPassword = !showPassword)"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>

        <v-checkbox
          v-model="loginFaceRecognition"
          label="Aktifkan Login Dengan Face Recognition"
        ></v-checkbox>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      edit: false,
      valid: true,
      editedItem: {},
      showPassword: false,
      loginFaceRecognition: false,
    };
  },
  computed: {
    ...mapState("authModule", ["id", "nama", "username", "password"]),
  },
};
</script>
