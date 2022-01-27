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

      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-autocomplete
              clearable
              dense
              outlined
              placeholder="Pilih Daftar Vote"
              prepend-inner-icon="mdi-vote"
              color="primary"
              class="mb-n6"
              :items="itemsDaftarVote"
              item-text="nama"
              item-value="id"
              v-model="selectedDaftarVote"
            ></v-autocomplete>

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <v-icon
                  class="ml-4"
                  v-bind="attrs"
                  v-on="on"
                  color="primary"
                  :disabled="!selectedDaftarVote"
                  @click.stop="getDataPerolahanSuara"
                >
                  mdi-refresh-circle
                </v-icon>
              </template>
              <span>Refresh Data</span>
            </v-tooltip>
          </v-card-title>
          <v-card-text v-if="selectedDaftarVote">
            <v-row class="justify-center">
              <v-col cols="6" sm="4" md="4" class="pb-2">
                <CardCustom
                  :loading="loadingPerolehanSuara"
                  color="success"
                  icon="mdi-account-multiple-check"
                  title="Telah Memilih"
                  :total="telah_memilih"
                  :full="false"
                />
              </v-col>
              <v-col cols="6" sm="4" md="4" class="pb-2">
                <CardCustom
                  :loading="loadingPerolehanSuara"
                  color="error"
                  icon="mdi-account-clock"
                  title="Belum Memilih"
                  :total="belum_memilih"
                  :full="false"
                />
              </v-col>
              <v-col cols="12">
                <v-chart
                  ref="chart"
                  class="chart"
                  :loading="loadingPerolehanSuara"
                  :option="option"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import moment from "moment";
import { mapState, mapActions } from "vuex";
import CardCustom from "../../components/CardCustom.vue";

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart, LineChart } from "echarts/charts";
import { LabelLayout, UniversalTransition } from "echarts/features";
import {
  DatasetComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TransformComponent,
} from "echarts/components";
import VChart from "vue-echarts";

use([
  DatasetComponent,
  CanvasRenderer,
  PieChart,
  LabelLayout,
  UniversalTransition,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TransformComponent,
]);

export default {
  components: {
    CardCustom,
    VChart,
  },
  // provide: {
  //   [THEME_KEY]: "dark",
  // },
  data: () => {
    return {
      option: {
        title: {
          text: "Chart Perolehan Suara",
          left: "center",
        },
        tooltip: {
          trigger: "axis",
          order: "valueDesc",
          axisPointer: {
            animation: false,
          },
        },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false,
          },
        },
        legend: {
          orient: "vertical",
          bottom: "bottom",
        },
        grid: { top: "50%" },
        series: [],
      },

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
      belum_memilih: 0,
      telah_memilih: 0,
      selectedDaftarVote: null,
      selectedDaftarVoteIndex: null,
      loading: true,
      loadingPerolehanSuara: false,
      listPerolehanSuara: [],
    };
  },
  async created() {
    let requestPromise = [this.loadData()];

    if (!this.itemsDaftarVote.length) requestPromise.push(this.getAll());

    await Promise.all(requestPromise);

    // this.selectedDaftarVote = 8;

    this.loading = false;
  },
  watch: {
    async selectedDaftarVote(val) {
      if (!val) {
        this.itemsKotakSuara = [];
        return;
      }

      this.selectedDaftarVoteIndex = this.itemsDaftarVote.findIndex(
        (v) => v.id == val
      );

      await this.getDataPerolahanSuara();
    },
  },
  computed: {
    ...mapState("daftarVoteModule", {
      itemsDaftarVote: "items",
    }),
    tanggal() {
      moment.locale("id");
      return moment().format("DD MMMM YYYY");
    },
  },
  methods: {
    ...mapActions("daftarVoteModule", ["getAll", "getDataPerolehanSuara"]),
    async loadData() {
      const res = await axios("total");

      const { kandidat, pemilih, vote_aktif } = res.data;

      this.items[0].total = kandidat;
      this.items[1].total = pemilih;
      this.items[2].total = vote_aktif;
    },
    async getDataPerolahanSuara() {
      if (!this.selectedDaftarVote) return;

      this.loadingPerolehanSuara = true;

      const res = await this.getDataPerolehanSuara({
        id: this.selectedDaftarVote,
      });

      if (res.status == 200) {
        const { telah_memilih, belum_memilih, kandidat } = res.data;

        this.telah_memilih = telah_memilih;
        this.belum_memilih = belum_memilih;
        this.listPerolehanSuara = kandidat;

        this.generateChartData();
      }

      this.loadingPerolehanSuara = false;
    },
    generateChartData() {
      const dataPie = this.listPerolehanSuara.map((k) => {
        return {
          name: k.nama,
          value: k.perolehan[k.perolehan.length - 1].total,
        };
      });

      let series = [
        {
          name: "Chart Perolehan Suara",
          type: "pie",
          radius: "30%",
          center: ["50%", "25%"],
          data: dataPie,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
          label: {
            formatter: "{b}: {c} Suara ({d}%)",
          },
        },
      ];

      for (const perolehan of this.listPerolehanSuara) {
        const data = perolehan.perolehan.map((p) => {
          return { name: p["waktu"], value: [p["waktu"], p["total"]] };
        });

        series.push({
          id: perolehan.nama + new Date(),
          name: perolehan.nama,
          type: "line",
          seriesLayoutBy: "row",
          showSymbol: false,
          smooth: true,
          data,
        });
      }

      this.$refs.chart.setOption(
        {
          series,
        },
        { replaceMerge: ["series"] }
      );
    },
  },
};
</script>

<style scoped>
.chart {
  height: 600px;
}
</style>
