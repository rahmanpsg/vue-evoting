<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          :showBtnTambah="false"
          :headers="headers"
          :items="itemsKotakSuara"
          itemKey="id"
          sortBy="id"
          :loading="loading"
        >
          <template v-slot:aksi>
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
                  @click.stop="getDataKotakSuara"
                >
                  mdi-refresh-circle
                </v-icon>
              </template>
              <span>Refresh Data</span>
            </v-tooltip>
          </template>
        </Table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Table from "@/components/Table.vue";
import { mapState, mapActions } from "vuex";

export default {
  components: {
    Table,
  },
  data() {
    return {
      loading: true,
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Nama Pemilih", value: "nama" },
        { text: "Username", value: "username" },
        { text: "Waktu Memilih", value: "waktu" },
      ],
      itemsKotakSuara: [],
      selectedDaftarVote: null,
      selectedDaftarVoteIndex: null,
    };
  },
  async created() {
    // cek jika data state telah diload
    if (!this.itemsDaftarVote.length) await this.getAll();

    this.loading = false;
  },
  watch: {
    selectedDaftarVote(val) {
      if (!val) {
        this.itemsKotakSuara = [];
        return;
      }

      this.selectedDaftarVoteIndex = this.itemsDaftarVote.findIndex(
        (v) => v.id == val
      );

      this.getDataKotakSuara();
    },
  },
  computed: {
    ...mapState("daftarVoteModule", {
      itemsDaftarVote: "items",
    }),
  },
  methods: {
    ...mapActions("daftarVoteModule", ["getAll", "getDataList"]),
    async getDataKotakSuara() {
      this.loading = true;

      const res = await this.getDataList({
        id: this.selectedDaftarVote,
        index: this.selectedDaftarVoteIndex,
        jenis: "kotaksuara",
      });

      this.itemsKotakSuara = res.data;

      this.loading = false;
    },
  },
};
</script>
