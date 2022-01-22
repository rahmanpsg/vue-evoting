<template>
  <v-card elevation="2" class="cardRadius">
    <v-card-title>
      <v-btn color="secondary" @click.stop="$emit('tambah')">
        <v-icon left> mdi-plus </v-icon>
        Tambah Data
      </v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Pencarian"
        single-line
        hide-details
        dense
      ></v-text-field>
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
      @click:row="selectRow"
    >
      <template v-slot:[`item.index`]="{ index }">
        {{ index + 1 }}
      </template>

      <template v-slot:[`item.foto`]="{ item }">
        <v-avatar size="150px" class="my-2">
          <img alt="Avatar" :src="fotoUrl(item.id, item)" />
        </v-avatar>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          class="d-flex justify-center"
          style="width: 100px"
          :color="item.status ? `green` : `red`"
          dark
        >
          {{ item.status ? "Aktif" : "Tidak Aktif" }}
        </v-chip>
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

export default {
  props: {
    headers: Array,
    items: Array,
    itemKey: String,
    sortBy: String,
    groupBy: String,
    loading: Boolean,
    expanded: Boolean,
    showSelect: Boolean,
    selectedFilter: String,
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
      this.$emit("update:selectedFilter", !row.isSelected ? item._id : null);
    },
    fotoUrl(id, item) {
      return `${axios.defaults.baseURL}kandidat/foto/${id}?cache=${item.cache}`;
    },
  },
};
</script>

<style scoped>
.cardRadius {
  border-radius: 0;
}
</style>
