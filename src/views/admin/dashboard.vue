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
          </v-card-title>
          <v-card-text>
            <v-row class="justify-center">
              <v-col cols="6" sm="4" md="4" class="pb-2">
                <v-card class="cardRadius">
                  <v-row class="no-gutters">
                    <v-col cols="12" sm="3" md="3">
                      <div
                        class="success fill-height d-flex py-4 justify-center"
                      >
                        <v-icon size="35" color="white">
                          mdi-account-multiple-check
                        </v-icon>
                      </div>
                    </v-col>
                    <div class="col pa-3 py-4 success--text">
                      <h5 class="text-truncate text-uppercase">
                        Telah Memilih
                      </h5>
                      <h1>{{ totalPermohonanDiterima }}</h1>
                    </div>
                  </v-row>
                </v-card>
              </v-col>
              <v-col cols="6" sm="4" md="4" class="pb-2">
                <v-card class="cardRadius">
                  <v-row class="no-gutters">
                    <v-col cols="12" sm="3" md="3">
                      <div class="error fill-height d-flex py-4 justify-center">
                        <v-icon size="35" color="white">
                          mdi-account-clock
                        </v-icon>
                      </div>
                    </v-col>
                    <v-col
                      cols="12"
                      sm="9"
                      md="9"
                      class="pa-3 py-4 error--text"
                    >
                      <h5 class="text-truncate text-uppercase">
                        Belum Memilih
                      </h5>
                      <h1>{{ totalPermohonanDitolak }}</h1>
                    </v-col>
                  </v-row>
                </v-card>
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
    let historyRefuelling = [
      {
        name: "2018-08-15T10:04:01.339Z",
        value: ["2018-08-15T10:04:01.339Z", 5],
      },
      {
        name: "2018-08-15T10:14:13.914Z",
        value: ["2018-08-15T10:14:13.914Z", 7],
      },
    ];

    let historyTheft = [
      {
        name: "2018-08-15T10:04:01.339Z",
        value: ["2018-08-15T10:04:01.339Z", 1],
      },
      {
        name: "2018-08-15T10:14:13.914Z",
        value: ["2018-08-15T10:14:13.914Z", 2],
      },
      {
        name: "2018-08-15T10:40:03.147Z",
        value: ["2018-08-15T10:40:03.147Z", 3],
      },
      {
        name: "2018-08-15T11:50:14.335Z",
        value: ["2018-08-15T11:50:14.335Z", 4],
      },
    ];

    // function randomData() {
    //   now = new Date(+now + oneDay);
    //   value = value + Math.random() * 21 - 10;
    //   value2 = value2 + Math.random() * 21 - 10;
    //   return [
    //     {
    //       name: now.toString(),
    //       value: [
    //         [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
    //         Math.round(value),
    //       ],
    //     },
    //     {
    //       name: now.toString(),
    //       value: [
    //         [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("/"),
    //         Math.round(value2),
    //       ],
    //     },
    //   ];
    // }
    let data = [];
    let data_b = [];
    let now = new Date(2020, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let value = Math.random() * 100;
    let value2 = Math.random() * 100;
    // for (var i = 0; i < 10; i++) {
    //   const r = randomData();
    //   data.push(r[0]);
    //   data_b.push(r[1]);
    // }

    console.log(data);

    return {
      data,
      data_b,
      now,
      oneDay,
      value,
      value2,
      option: {
        title: {
          text: "Real Time Perolehan Suara",
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
        series: [
          {
            id: "1",
            name: "Fake Data",
            type: "line",
            showSymbol: false,
            data: data,
          },
          {
            id: "2",
            name: "Fake Data 2",
            type: "line",
            showSymbol: false,
            data: data_b,
          },
        ],
      },
      optionLineChart: {
        animationDuration: 10000,
        title: {
          text: "Realtime Perolehan Suara",
          left: "center",
          // padding: 10
        },
        tooltip: {
          trigger: "axis",
          showContent: false,
        },
        legend: {
          data: [
            "Direct",
            "Email",
            "Ad Networks",
            "Video Ads",
            "Search Engines",
          ],
          bottom: "bottom",
        },
        dataset: {
          source: [
            [
              "kandidat",
              "2018-08-15T10:04:01.339Z",
              "2018-08-15T10:14:13.914Z",
              "2018-08-15T10:40:03.147Z",
              "2018-08-15T11:50:14.335Z",
            ],
            ["Rahman", 1, 5, 20, 35],
            ["Lina", 5, 20, 35, 39],
          ],
        },
        // dataset: {
        //   source: [
        //     ["kandidat", "2020/01/01"],
        //     ["rahman", 100],
        //     ["lina", 50],
        //   ],
        // },
        xAxis: {
          type: "time",
          splitLine: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          // boundaryGap: [0, "100%"],
          splitLine: {
            show: false,
          },
          // gridIndex: 0,
        },
        // xAxis: { type: "category" },
        // yAxis: { gridIndex: 0 },
        grid: { top: "50%" },
        series: [
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "28%"],
            emphasis: {
              focus: "self",
            },
            label: {
              formatter: "{b}: {c} ({d}%)",
            },
            // encode: {
            //   itemName: "kandidat",
            //   value: "2020/01/04",
            //   tooltip: "2020/01/04",
            // },
            encode: {
              x: "kandidat",
              y: "value",
              itemId: "kandidat",
            },
          },
          {
            backgroundColor: "#4D86FF",
            name: "Refuelling",
            type: "line",
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: "default" } } },
            data: historyRefuelling,
          },
          {
            name: "Fuel Theft",
            type: "line",
            smooth: true,
            itemStyle: { normal: { areaStyle: { type: "default" } } },

            data: historyTheft,
          },
        ],
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
      totalPermohonanDiterima: 0,
      totalPermohonanDitolak: 0,
      selectedDaftarVote: null,
      selectedDaftarVoteIndex: null,
      loading: true,
      loadingPerolehanSuara: false,
    };
  },
  async created() {
    let requestPromise = [this.loadData()];

    if (!this.itemsDaftarVote.length) requestPromise.push(this.getAll());

    await Promise.all(requestPromise);

    console.log(this.$refs.chart.getOption());

    const randomData = () => {
      this.now = new Date(+this.now + this.oneDay);
      this.value = this.value + Math.random() * 21 - 10;
      this.value2 = this.value2 + Math.random() * 21 - 10;
      return [
        {
          name: this.now.toString(),
          value: [
            [
              this.now.getFullYear(),
              this.now.getMonth() + 1,
              this.now.getDate(),
            ].join("/"),
            Math.round(this.value),
          ],
        },
        {
          name: this.now.toString(),
          value: [
            [
              this.now.getFullYear(),
              this.now.getMonth() + 1,
              this.now.getDate(),
            ].join("/"),
            Math.round(this.value2),
          ],
        },
      ];
    };

    const i = setInterval(() => {
      for (var i = 0; i < 5; i++) {
        const r = randomData();
        // this.data.shift();
        // this.data_b.shift();
        this.data.push(r[0]);
        this.data_b.push(r[1]);
      }

      console.log(this.data);
      this.$refs.chart.setOption({
        series: [
          {
            data: this.data,
          },
          {
            data: this.data_b,
          },
        ],
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(i);
    }, 5000);

    this.loading = false;
  },
  mounted() {
    console.log(this.$refs.chart);
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

      //
      this.loadingPerolehanSuara = true;

      const res = await this.getDataPerolehanSuara({
        id: val,
      });

      console.log(res);
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
    chartReady(instance, ECharts) {
      console.log(instance, ECharts);
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

.chart {
  height: 500px;
}
</style>
