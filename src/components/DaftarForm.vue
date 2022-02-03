<template>
  <v-main>
    <v-container>
      <v-alert
        :value="alertRest.show"
        :type="alertRest.type"
        transition="scale-transition"
        dense
      >
        {{ alertRest.text }}
      </v-alert>
    </v-container>

    <v-layout justify-center class="mt-2">
      <h2 class="text-center">Registrasi</h2>
    </v-layout>

    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
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

        <v-text-field
          v-model="editedItem.nama"
          label="Nama"
          :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
          required
        ></v-text-field>

        <v-text-field
          v-model="editedItem.username"
          label="Username"
          :rules="[(v) => !!v || 'Username tidak boleh kosong']"
          required
          autocomplete="false"
        ></v-text-field>

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

        <v-textarea
          v-model="editedItem.alamat"
          label="Alamat"
          :rules="[(v) => !!v || 'Alamat tidak boleh kosong']"
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn color="primary" @click="submit" block :disabled="loading">
        <v-icon left dark>mdi-account-plus</v-icon> Daftar
      </v-btn>
    </v-card-actions>
    <v-card-text class="py-2">
      Sudah punya akun?
      <a color="secondary" @click="$emit('setShow', 'login')">Login</a>
    </v-card-text>
  </v-main>
</template>

<script>
import PemilihModel from "@/models/pemilih";

export default {
  data: () => ({
    valid: true,
    loading: false,
    editedItem: {},
    showPassword: false,
    alertRest: { show: false, type: "warning", text: "" },
  }),
  methods: {
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    async submit() {
      this.alertRest.show = false;

      await this.$refs.form.validate();

      if (!this.valid) return;

      this.$emit("setLoading", true);

      const item = new PemilihModel(this.editedItem);

      const res = await this.$store.dispatch("authModule/registrasi", item);

      this.$emit("setLoading", false);
      this.alertRest.show = true;

      if (res.status == 201) {
        this.alertRest.text = res.data.message;
        this.alertRest.type = "success";
      } else {
        this.alertRest.text = res.data.detail;
        this.alertRest.type = "warning";
        return;
      }

      setTimeout(() => {
        this.$emit("setShow", "login");
      }, 2000);
    },
  },
};
</script>
