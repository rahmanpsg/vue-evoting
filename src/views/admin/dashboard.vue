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
          src="@/assets/yukvoting.png"
          transition="scale-transition"
          width="150"
        ></v-img>
        <h1 class="primary--text">Selamat Datang Di Aplikasi E-Voting</h1>
        <h3 class="primary--text">
          Pemilihan Ketua RW Kelurahan Cappagalung Kecamatan Bacukiki Barat Kota
          Parepare
        </h3>
      </v-col>
      <v-col
        v-for="(item, i) in items"
        :key="i"
        cols="12"
        sm="4"
        md="4"
        class="pb-2"
      >
        <CardCustom
          :loading="loading"
          :color="item.color"
          :icon="item.icon"
          :title="item.title"
          :total="item.total"
        />
      </v-col>

      <v-col cols="12"> <ChartSuara /> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
import CardCustom from "../../components/CardCustom.vue";
import ChartSuara from "../../components/ChartSuara.vue";

export default {
  components: {
    CardCustom,
    ChartSuara,
  },
  data: () => {
    return {
      items: [
        {
          title: "Total Kandidat",
          total: 0,
          color: "secondary",
          icon: "mdi-account-tie",
          // loading: this.loading,
        },
        {
          title: "Total Pemilih",
          total: 0,
          color: "orange",
          icon: "mdi-account-group",
          // loading: this.loading,
        },
        {
          title: "Total Vote Aktif",
          total: 0,
          color: "primary",
          icon: "mdi-vote",
          // loading: this.loading,
        },
      ],
      kandidat: 0,
      pemilih: 0,
      vote_aktif: 0,

      loading: true,
    };
  },
  async created() {
    // let requestPromise = [this.loadData()];

    // if (!this.itemsDaftarVote.length) requestPromise.push(this.getAll());

    // await Promise.all(requestPromise);

    // this.selectedDaftarVote = 8;

    await this.loadData();

    this.loading = false;
  },

  computed: {
    tanggal() {
      moment.locale("id");
      return moment().format("DD MMMM YYYY");
    },
  },
  methods: {
    async loadData() {
      const res = await axios("total");

      const { kandidat, pemilih, vote_aktif } = res.data;

      this.items[0].total = kandidat;
      this.items[1].total = pemilih;
      this.items[2].total = vote_aktif;
    },
  },
};
</script>
