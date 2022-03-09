<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12"> Grafik Perolehan Suara </v-col>
        <v-col cols="10" sm="11" md="11">
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
        </v-col>
        <v-col cols="2" sm="1" md="1">
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
        </v-col>
      </v-row>
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
</template>

<script>
import moment from "moment";
import { mapState, mapActions } from "vuex";

import CardCustom from "../components/CardCustom.vue";

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
      selectedDaftarVote: null,
      selectedDaftarVoteIndex: null,
      loadingPerolehanSuara: false,
      listPerolehanSuara: [],
      belum_memilih: 0,
      telah_memilih: 0,
    };
  },
  async created() {
    if (!this.itemsDaftarVote.length) await this.getAll();

    this.loadingPerolehanSuara = false;
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
      itemsDV: "items",
    }),
    itemsDaftarVote() {
      return this.itemsDV.filter((item) => {
        const waktu_mulai = moment(`${item.tanggal_mulai} ${item.jam_mulai}`);

        return waktu_mulai.isBefore(moment());
      });
    },
  },
  methods: {
    ...mapActions("daftarVoteModule", ["getAll", "getDataPerolehanSuara"]),
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
