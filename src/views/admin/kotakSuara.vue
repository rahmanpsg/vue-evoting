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
          </template>
        </Table>
      </v-col>
    </v-row>
    <!-- <v-snackbar
      :timeout="2000"
      v-model="response.show"
      centered
      text
      outlined
      :color="response.type"
    >
      <v-alert :type="response.type" text shaped prominent>
        <strong v-text="response.text"></strong>
      </v-alert>
    </v-snackbar> -->
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
        { text: "Waktu Memilih", value: "tanggal" },
      ],
      showPassword: false,
      itemsKotakSuara: [],
      selectedDaftarVote: null,
    };
  },
  async created() {
    // cek jika data state telah diload
    let requestPromise = [];

    if (!this.itemsDaftarVote.length) requestPromise.push(this.getAll());

    if (!this.itemsPemilih.length)
      requestPromise.push(this.$store.dispatch("pemilihModule/getAll"));

    await Promise.all(requestPromise);
    this.loading = false;
  },
  watch: {
    selectedDaftarVote(val) {
      const items = this.itemsDaftarVote.find((item) => item.id == val);

      if (!items) return;

      const itemsFilter = items.list_pemilih.filter(
        (item) => item.vote_nomor != -1
      );

      this.itemsKotakSuara = itemsFilter.map((pemilih) => {
        return {
          ...pemilih,
          ...this.itemsPemilih.find((k) => k.id == pemilih.id),
        };
      });
    },
  },
  computed: {
    ...mapState("daftarVoteModule", { itemsDaftarVote: "items" }),
    ...mapState("pemilihModule", { itemsPemilih: "items" }),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Pemilih"
        : "Edit Data Pemilih";
    },
  },
  methods: {
    ...mapActions("daftarVoteModule", ["getAll"]),
  },
};
</script>
