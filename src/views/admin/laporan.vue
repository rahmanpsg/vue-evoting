<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card elevation="3">
          <v-card-title>
            <v-col cols="12" sm="12" md="12">
              <v-autocomplete
                v-model="selectedLaporan"
                item-value="value"
                :items="listLaporan"
                placeholder="Pilih Laporan"
                dense
                outlined
              >
              </v-autocomplete>
            </v-col>

            <v-col
              cols="12"
              sm="12"
              md="12"
              class="d-flex flex-row-reverse mt-n6"
            >
              <v-btn
                outlined
                color="primary"
                :disabled="!cetak"
                @click="cetakClick"
              >
                <v-icon left> mdi-printer </v-icon> Cetak
              </v-btn>
            </v-col>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col> </v-col>
      <dialog-cetak
        :laporan="selectedLaporan"
        :dialog="dialog"
        @closeDialog="dialog = false"
      />
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { Capacitor, Plugins } from "@capacitor/core";

const { Browser } = Plugins;

import DialogCetak from "@/components/DialogCetak.vue";

export default {
  components: {
    DialogCetak,
  },
  data() {
    return {
      loading: true,
      selectedLaporan: null,
      cetak: false,
      dialog: false,
      listLaporan: [
        { text: "Daftar Kandidat", value: "kandidat" },
        { text: "Daftar Pemilih", value: "pemilih" },
        { text: "Daftar Vote", value: "daftarvote" },
      ],
    };
  },
  watch: {
    selectedLaporan(val) {
      if (val == null) return;
      this.cetak = true;
    },
  },
  methods: {
    async cetakClick() {
      if (Capacitor.getPlatform() == "android") {
        const url = `${axios.defaults.baseURL || ""}cetak/${
          this.selectedLaporan
        }`;
        await Browser.open({ url });
      } else {
        this.dialog = true;
      }
    },
  },
};
</script>
