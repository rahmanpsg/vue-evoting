<template>
  <v-container fluid fill-height class="accent">
    <v-card class="mx-auto" width="90%">
      <v-card-title class="text-center justify-center py-6">
        <v-row>
          <v-col cols="12">
            <v-img
              src="@/assets/yukvoting.png"
              class="mx-auto"
              width="300px"
            ></v-img>
          </v-col>
        </v-row>
      </v-card-title>

      <v-tabs v-model="tab" background-color="transparent" color="basil" grow>
        <v-tab v-for="item in items" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <!-- <v-tab-item v-for="item in items" :key="item">
          <v-card color="basil" flat>
            <v-card-text>{{ text }}</v-card-text>
          </v-card>
        </v-tab-item> -->
        <v-tab-item>
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

            <!-- <daftar-form
              v-if="show == 'daftar'"
              @setLoading="setLoading"
              @setShow="setShow"
            ></daftar-form> -->
          </v-card>
        </v-tab-item>

        <v-tab-item>
          <ChartSuara />
        </v-tab-item>
      </v-tabs-items>
    </v-card>

    <v-row>
      <v-col>
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
import ChartSuara from "../components/ChartSuara.vue";

export default {
  components: {
    LoginForm,
    CameraForm,
    ChartSuara,
  },
  data: () => ({
    show: "login",
    valid: true,
    loading: false,
    username: "",
    password: "",
    tab: null,
    items: ["Login", "Grafik Perolehan Suara"],
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
