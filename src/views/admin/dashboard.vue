<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-row class="no-gutters">
          <v-icon color="grey"> mdi-calendar </v-icon>
          <h4 class="blue-grey--text text--lighten-1">
            {{ tanggal }}
          </h4>
        </v-row>
      </v-col>
      <v-col cols="12" class="text-center">
        <v-img
          class="mx-auto"
          :src="require('@/assets/logo.png')"
          transition="scale-transition"
          width="100"
        ></v-img>
        <h1 class="primary--text">Selamat Datang Di Aplikasi E-Voting</h1>
        <h3 class="primary--text">
          Pemilihan Ketua RW Kelurahan Cappagalung Kecamatan Bacukiki Barat Kota
          Parepare
        </h3>
      </v-col>
      <v-col cols="12" sm="4" md="4" class="pb-2">
        <v-card class="cardRadius">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="secondary fill-height d-flex pa-5">
                <v-icon size="35" color="white"> mdi-account-tie </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 secondary--text">
              <h5 class="text-truncate text-uppercase">Total Kandidat</h5>
              <h1>{{ totalPegawai }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" md="4" class="pb-2">
        <v-card class="cardRadius">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="orange fill-height d-flex pa-5">
                <v-icon size="35" color="white"> mdi-account-group </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 orange--text">
              <h5 class="text-truncate text-uppercase">Total Pemilih</h5>
              <h1>{{ totalPermohonanDiproses }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4" md="4" class="pb-2">
        <v-card class="cardRadius">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="primary fill-height d-flex pa-5">
                <v-icon size="35" color="white"> mdi-vote </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 primary--text">
              <h5 class="text-truncate text-uppercase">Total Vote Aktif</h5>
              <h1>{{ totalPermohonan }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="6" class="pb-2">
        <v-card class="cardRadius">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="success fill-height d-flex pa-5">
                <v-icon size="35" color="white">
                  mdi-account-multiple-check
                </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 success--text">
              <h5 class="text-truncate text-uppercase">Telah Memilih</h5>
              <h1>{{ totalPermohonanDiterima }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="6" class="pb-2">
        <v-card class="cardRadius">
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="error fill-height d-flex pa-5">
                <v-icon size="35" color="white"> mdi-account-clock </v-icon>
              </div>
            </div>
            <div class="col pa-3 py-4 error--text">
              <h5 class="text-truncate text-uppercase">Belum Memilih</h5>
              <h1>{{ totalPermohonanDitolak }}</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  components: {},
  data: () => ({
    totalPegawai: 0,
    totalPermohonan: 0,
    totalPermohonanDiproses: 0,
    totalPermohonanDiterima: 0,
    totalPermohonanDitolak: 0,
    loading: true,
    headers: [
      {
        text: "#",
        align: "center",
        sortable: false,
        value: "index",
      },
      { text: "Nama", value: "nama", width: 450 },
      {
        text: "Jam Datang",
        value: "waktuDatang",
        align: "center",
      },
      { text: "Jam Pulang", value: "waktuPulang", align: "center" },
    ],
  }),
  async created() {
    this.loading = true;
    // await this.resetPermohonans();
    // await this.loadData();
    // await this.getAll();
    this.loading = false;
  },
  computed: {
    // ...mapState("PermohonanModule", { listPermohonan: "Permohonans" }),
    tanggal() {
      moment.locale("id");
      return moment().format("DD MMMM YYYY");
    },
  },
  methods: {
    // ...mapActions("PermohonanModule", ["getAll", "resetPermohonans"]),
    async loadData() {
      const res = await axios("total");

      const {
        totalPegawai,
        totalPermohonan,
        totalPermohonanDiproses,
        totalPermohonanDiterima,
        totalPermohonanDitolak,
      } = res.data;

      this.totalPegawai = totalPegawai;
      this.totalPermohonan = totalPermohonan;
      this.totalPermohonanDiproses = totalPermohonanDiproses;
      this.totalPermohonanDiterima = totalPermohonanDiterima;
      this.totalPermohonanDitolak = totalPermohonanDitolak;
    },
  },
};
</script>

<style scoped>
.cardRadius {
  border-radius: 0px;
}

.cardRadius .fill-height {
  border-radius: 0px 0 0 0px;
}
</style>
