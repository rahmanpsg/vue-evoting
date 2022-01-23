<template>
  <v-card elevation="2" class="cardRadius">
    <v-card-title>
      <template v-if="!showCustomAksi">
        <v-btn color="secondary" @click.stop="$emit('tambah')">
          <v-icon left> mdi-plus </v-icon>
          Tambah Data
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="showSearch"
          v-model="search"
          append-icon="mdi-magnify"
          label="Pencarian"
          single-line
          hide-details
          dense
        ></v-text-field>
      </template>
      <template v-else>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="success"
              class="mx-2"
              @click.stop="$emit('tambah')"
              small
              :disabled="!isSelected"
            >
              <v-icon> mdi-account-plus </v-icon>
            </v-btn>
          </template>
          <span>Tambah Data</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="error"
              @click.stop="$emit('tambah')"
              small
              :disabled="!isSelected"
            >
              <v-icon> mdi-account-cancel</v-icon>
            </v-btn>
          </template>
          <span>Reset Data</span>
        </v-tooltip>
      </template>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :item-key="itemKey"
      :items-per-page="10"
      :search="search"
      :loading="loading"
      :group-by="groupBy"
      :show-group-by="groupBy != null"
      loading-text="Loading data..."
      :show-expand="expanded"
      :single-expand="true"
      :sort-by="sortBy"
      :show-select="showSelect"
      single-select
      :hide-default-footer="hideFooter"
      @click:row="selectRow"
    >
      <template v-slot:[`item.index`]="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:[`item.tanggal`]="{ item }">
        {{ formatTanggal(item) }}
      </template>

      <template v-slot:[`item.foto`]="{ item }">
        <v-avatar size="150px" class="my-2">
          <img alt="Avatar" :src="fotoUrl(item.id, item)" />
        </v-avatar>
      </template>

      <template v-slot:[`item.fotoKandidat`]="{ item }">
        <v-avatar class="my-2">
          <img alt="Avatar" :src="fotoUrl(item.id, item)" />
        </v-avatar>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          class="d-flex justify-center"
          style="width: 100px"
          :color="item.status ? `green` : `red`"
          dark
          small
        >
          {{ item.status ? "Aktif" : "Tidak Aktif" }}
        </v-chip>
      </template>

      <template v-slot:[`item.aksiKandidat`]="{ index }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              :color="!index ? 'grey' : 'success'"
              :disabled="!index"
              @click="$emit('up', index)"
            >
              mdi-arrow-up-thick
            </v-icon>
          </template>
          <span>Naikan Nomor Urut</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              :color="index == items.length - 1 ? 'grey' : 'success'"
              :disabled="index == items.length - 1"
              @click.stop="$emit('down', index)"
            >
              mdi-arrow-down-thick
            </v-icon>
          </template>
          <span>Turunkan Nomor Urut</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.aksi`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              color="warning"
              @click.stop="$emit('edit', item)"
            >
              mdi-pencil-box-multiple
            </v-icon>
          </template>
          <span>Edit Data</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="error"
              @click.stop="$emit('hapus', item)"
            >
              mdi-close-box-multiple
            </v-icon>
          </template>
          <span>Hapus Data</span>
        </v-tooltip>
      </template>

      <template v-slot:top>
        <slot name="modal"></slot>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  props: {
    headers: Array,
    items: Array,
    itemKey: String,
    sortBy: String,
    groupBy: String,
    loading: Boolean,
    expanded: Boolean,
    showSearch: {
      default: true,
      type: Boolean,
    },
    showSelect: Boolean,
    hideFooter: {
      default: false,
      type: Boolean,
    },
    showCustomAksi: Boolean,
    selectedFilter: Number,
    isSelected: {
      default: false,
      type: Boolean,
    },
  },
  data: () => ({
    search: "",
  }),
  computed: {
    url() {
      // console.log(this.items);
      return this.items.map(
        (item) =>
          `${axios.defaults.baseURL}kandidat/foto/${item.id}?cache=${
            item.cache ?? new Date().getTime()
          }`
      );
    },
  },
  methods: {
    selectRow(item, row) {
      row.select(!row.isSelected);

      this.$emit("update:isSelected", !row.isSelected);
      this.$emit("update:selectedFilter", !row.isSelected ? item.id : null);
    },

    fotoUrl(id, item) {
      return `${axios.defaults.baseURL}kandidat/foto/${id}?cache=${item.cache}`;
    },
    formatTanggal(item) {
      moment.locale("id");

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
    },
    formatTotalKandidat(kandidat) {
      let res;
      switch (kandidat.length) {
        case 0:
          res = `<v-chip
          class="d-flex justify-center"
          style="width: 100px"
          color="red"
          dark
        >
          Belum ada kandidat
        </v-chip>`;
          break;

        default:
          break;
      }

      return res;
    },
  },
};
</script>

<style scoped>
.cardRadius {
  border-radius: 0;
}
</style>
