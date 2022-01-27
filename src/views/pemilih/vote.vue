<template>
  <v-row align="center" justify="center">
    <v-col cols="12" class="text-center">
      <h1 v-text="daftarVote.nama"></h1>
    </v-col>
    <v-col cols="12">
      <countdown :end-time="waktuSelesai">
        <span
          class="font-weight-bold"
          slot="process"
          slot-scope="{ timeObj }"
          >{{
            `Sisa Waktu: ${timeObj.d > 0 ? timeObj.d + " Hari" : ""} ${
              timeObj.h
            } Jam ${timeObj.m} Menit ${timeObj.s} Detik`
          }}</span
        >
        <span slot="finish" class="font-weight-bold"
          >Voting Telah Berakhir!</span
        >
      </countdown>
    </v-col>

    <v-col>
      <v-item-group active-class="primary">
        <v-container>
          <v-row justify="center">
            <v-col
              v-for="(kandidat, i) in daftarVote.list_kandidat"
              :key="kandidat.id"
              class="d-flex child-flex"
              cols="12"
              sm="4"
              md="4"
            >
              <v-hover v-slot="{ hover }">
                <v-card :elevation="hover ? 12 : 2">
                  <v-img
                    :src="getImgKandidat(kandidat.id)"
                    aspect-ratio="1"
                    class="grey lighten-2"
                  >
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                  <v-card-text class="pt-6" style="position: relative">
                    <v-btn
                      absolute
                      color="primary"
                      class="white--text"
                      fab
                      large
                      right
                      top
                      @click="
                        SelectedkandidatIndex = i;
                        dialog = true;
                      "
                    >
                      <v-icon>mdi-vote</v-icon>
                    </v-btn>
                    <template v-if="!loading">
                      <div class="font-weight-light grey--text text-h6 mb-2">
                        Nomor Urut {{ kandidat.nomor }}
                      </div>
                      <h3 class="text-h4 font-weight-light primary--text mb-2">
                        {{ listDataKandidat[i].nama }}
                      </h3>
                      <div class="font-weight-light text-h6 mb-2">
                        {{ listDataKandidat[i].keterangan }}
                      </div>
                    </template>
                    <v-skeleton-loader
                      v-if="loading"
                      class="mx-auto"
                      max-width="300"
                      type="list-item-three-line"
                    ></v-skeleton-loader>
                  </v-card-text>
                </v-card>
              </v-hover>
            </v-col>
          </v-row>
        </v-container>
      </v-item-group>
    </v-col>
    <DialogHapus
      :title="dialogTitle"
      :dialog="dialog"
      :dialogLoading="dialogLoading"
      @closeDialog="dialog = false"
      @hapus="setVote"
    />

    <v-snackbar v-model="response.show" :multi-line="true" center vertical>
      <strong v-text="response.text"></strong>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

import DialogHapus from "../../components/DialogHapus.vue";

export default {
  components: { DialogHapus },
  data() {
    return {
      listDataKandidat: [],
      SelectedkandidatIndex: null,
      loading: true,
      dialog: false,
      dialogLoading: false,
      response: {
        show: false,
        text: null,
      },
    };
  },
  async created() {
    await this.loadDataKandidat();

    console.log(this.daftarVote);

    this.loading = false;
  },
  computed: {
    ...mapState("daftarVoteModule", ["items", "selectedIndex"]),
    daftarVote() {
      return this.items[this.selectedIndex];
    },
    waktuSelesai() {
      return new Date(
        `${this.daftarVote.tanggal_selesai} ${this.daftarVote.jam_selesai}`
      );
    },
    dialogTitle() {
      if (this.SelectedkandidatIndex == null) return;
      const kandidat =
        this.daftarVote.list_kandidat[this.SelectedkandidatIndex];

      return `Anda yakin untuk memilih nomor urut ${kandidat.nomor}`;
    },
  },
  methods: {
    async loadDataKandidat() {
      const kandidat = this.daftarVote.list_kandidat.map(async (daftar) => {
        const res = await this.$store.dispatch(
          "kandidatModule/getKandidat",
          daftar.id
        );

        return res.data;
      });

      this.listDataKandidat = await Promise.all(kandidat);
    },
    getImgKandidat(id) {
      return `${axios.defaults.baseURL}kandidat/foto/${id}`;
      //   return `${
      //     axios.defaults.baseURL
      //   }kandidat/foto/${id}?c=${new Date().getTime()}`;
    },
    async setVote() {
      this.dialogLoading = true;

      const res = await this.$store.dispatch("daftarVoteModule/simpanVote", {
        idDaftarVote: this.daftarVote.id,
        idPemilih: this.$store.state.authModule.id,
        voteNomor:
          this.daftarVote.list_kandidat[this.SelectedkandidatIndex].nomor,
      });

      if (res.status == 201) {
        this.response.text = res.data.message;
      } else {
        this.response.text = res.data.detail;
      }

      this.dialog = false;
      this.dialogLoading = false;
      this.response.show = true;
    },
  },
};
</script>
