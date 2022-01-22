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
      <h2 class="text-center">Sign In</h2>
    </v-layout>

    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="username"
          :rules="[(v) => !!v || 'Username tidak boleh kosong']"
          label="Username"
          required
          prepend-inner-icon="mdi-account"
        ></v-text-field>

        <v-text-field
          type="password"
          v-model="password"
          :rules="[(v) => !!v || 'Password tidak boleh kosong']"
          label="Password"
          required
          prepend-inner-icon="mdi-key"
        ></v-text-field>

        <a color="secondary" @click="$emit('setShow')"
          >Login dengan Face Recognition</a
        >
      </v-form>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn color="primary" @click="submit" block :disabled="loading">
        <v-icon left dark>mdi-login-variant</v-icon> Login
      </v-btn>
    </v-card-actions>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    valid: true,
    loading: false,
    username: "",
    password: "",
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

      const res = await this.$store.dispatch("authModule/login", {
        username: this.username,
        password: this.password,
      });

      this.$emit("setLoading", false);
      this.alertRest.show = true;

      if (res.status !== 200) {
        this.alertRest.text = res.data.detail;
        this.alertRest.type = "warning";
        return;
      }

      this.$store.commit("authModule/setData", res.data);
      this.$emit("setLoading", true);
      this.alertRest.text = `Anda berhasil login sebagai ${res.data.user.nama}`;
      this.alertRest.type = "success";

      setTimeout(() => {
        this.$store.commit("authModule/isLogin", true);
        this.$router.push(res.data.user.role);
      }, 2000);
    },
  },
};
</script>
