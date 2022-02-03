<template>
  <v-container fluid fill-height class="accent">
    <v-row>
      <v-col cols="12">
        <v-img
          src="@/assets/yukvoting.png"
          class="mx-auto"
          width="300px"
        ></v-img>
      </v-col>
      <v-col>
        <v-card
          elevation="0"
          :loading="loading"
          class="mx-auto mb-12"
          width="100%"
          max-width="500"
          v-bind:key="show"
        >
          <login-form
            v-if="show == 'login'"
            @setLoading="setLoading"
            @setShow="setShow"
          >
          </login-form>

          <camera-form
            v-if="show == 'camera'"
            @setLoading="setLoading"
            @setShow="setShow"
          />

          <daftar-form
            v-if="show == 'daftar'"
            @setLoading="setLoading"
            @setShow="setShow"
          ></daftar-form>
        </v-card>
        <h4 class="py-2 white--text text-center">
          &copy; {{ new Date().getFullYear() }} —
          <strong>Aplikasi E-Voting</strong>
        </h4>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LoginForm from "../components/LoginForm.vue";
import CameraForm from "../components/CameraForm.vue";
import DaftarForm from "../components/DaftarForm.vue";

export default {
  components: {
    LoginForm,
    CameraForm,
    DaftarForm,
  },
  data: () => ({
    show: "login",
    valid: true,
    loading: false,
    username: "",
    password: "",
  }),
  methods: {
    setLoading(loading) {
      this.loading = loading;
    },
    setShow(show) {
      this.show = show;
    },
  },
};
</script>
