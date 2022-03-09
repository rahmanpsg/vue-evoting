<template>
  <v-row align="center" justify="center">
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
        width="100"
      ></v-img>
      <h1 class="primary--text">Selamat Datang Di Aplikasi E-Voting</h1>
      <h3 class="primary--text">
        Pemilihan Ketua RW Kelurahan Cappagalung Kecamatan Bacukiki Barat Kota
        Parepare
      </h3>
    </v-col>
    <v-col>
      <v-card class="mx-auto">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>
            <h3>Daftar Vote</h3>
          </v-toolbar-title>

          <v-spacer></v-spacer>

          <!-- <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn> -->

          <v-btn icon>
            <v-icon>mdi-vote</v-icon>
          </v-btn>
        </v-toolbar>

        <v-list subheader three-line>
          <v-list-item-group color="primary" v-model="selectedDaftarVote">
            <template v-for="(daftarVote, i) in items">
              <v-list-item
                v-if="daftarVote"
                :key="i"
                @click.native="toVotePage"
              >
                <v-list-item-avatar>
                  <v-icon class="grey lighten-1" dark> mdi-vote </v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    v-text="daftarVote.nama"
                  ></v-list-item-title>

                  <v-list-item-subtitle
                    v-text="daftarVote.keterangan"
                  ></v-list-item-subtitle>

                  <v-list-item-subtitle
                    v-text="tanggalDaftarVote[i]"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn
                    :color="daftarVote.telah_memilih ? 'primary' : 'warning'"
                    class="white--text"
                    small
                    right
                  >
                    <v-icon>{{
                      daftarVote.telah_memilih
                        ? "mdi-check-decagram"
                        : "mdi-timer-sand-empty"
                    }}</v-icon>
                    {{
                      daftarVote.telah_memilih
                        ? "Telah melakukan voting"
                        : "Belum melakukan voting"
                    }}
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider v-if="daftarVote" :key="`div-${i}`" inset></v-divider>
            </template>

            <v-list-item v-if="!items.length">
              <v-list-item-content>
                <v-progress-circular
                  indeterminate
                  color="primary"
                  v-if="loading"
                ></v-progress-circular>
                <v-list-item-title v-else class="text-center"
                  >Anda belum memiliki daftar vote</v-list-item-title
                >
              </v-list-item-content></v-list-item
            >
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-col>
    <v-snackbar v-model="snackbar" top> Voting belum dimulai </v-snackbar>
  </v-row>
</template>

<script>
import moment from "moment";

import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      loading: true,
      selectedDaftarVote: null,
      snackbar: false,
    };
  },
  async created() {
    let requestPromise = [];

    if (!this.itemsKandidat.length)
      requestPromise.push(this.$store.dispatch("kandidatModule/getAll"));

    if (!this.items.length) requestPromise.push(this.getByPemilih());

    await Promise.all(requestPromise);

    this.loading = false;
  },
  computed: {
    ...mapState("daftarVoteModule", ["items"]),
    tanggal() {
      moment.locale("id");
      return moment().format("DD MMMM YYYY");
    },
    tanggalDaftarVote() {
      moment.locale("id");

      return this.items.map((item) => {
        const tgl_mulai = moment(
          `${item.tanggal_mulai} ${item.jam_mulai}`
        ).format("lll");

        let tgl_selesai;

        if (item.tanggal_mulai == item.tanggal_selesai) {
          tgl_selesai = moment(
            `${item.tanggal_selesai} ${item.jam_selesai}`
          ).format("HH.mm");
        } else {
          tgl_selesai = moment(
            `${item.tanggal_selesai} ${item.jam_selesai}`
          ).format("lll");
        }

        return `${tgl_mulai} - ${tgl_selesai}`;
      });
    },
  },
  methods: {
    ...mapActions("daftarVoteModule", ["getByPemilih"]),
    ...mapState("kandidatModule", { itemsKandidat: "items" }),
    toVotePage() {
      if (this.selectedDaftarVote == undefined) return;

      if (this.items[this.selectedDaftarVote].telah_memilih) return;

      const { tanggal_mulai, jam_mulai } = this.items[this.selectedDaftarVote];

      if (moment(`${tanggal_mulai} ${jam_mulai}`).isAfter(moment())) {
        this.snackbar = true;
        return;
      }

      this.$store.commit(
        "daftarVoteModule/setSelectedIndex",
        this.selectedDaftarVote
      );

      this.$router.push("/pemilih/vote");
    },
  },
};
</script>
