<template>
  <v-dialog v-model="dialogModel" persistent max-width="600">
    <template v-slot:default="dialog">
      <v-card v-if="dialog" class="mx-auto">
        <v-toolbar color="primary" dark>
          <v-toolbar-title>Daftar {{ jenis }}</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-text-field
            @focus="searchClosed = false"
            @blur="searchClosed = true"
            v-model="search"
            label="Cari"
            prepend-inner-icon="mdi-magnify"
            class="expanding-search mt-4"
            :class="{
              closed: searchClosed && !search,
            }"
            dense
            clearable
          ></v-text-field>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="tambahSemua">
                <v-icon>mdi-account-multiple-plus</v-icon>
              </v-btn>
            </template>
            <span>Tambahkan Semua {{ jenis }}</span>
          </v-tooltip>
        </v-toolbar>

        <v-list>
          <v-list-item-group
            :value="selected"
            @change="changeSelected"
            active-class="primary--text"
            multiple
          >
            <template v-for="(item, index) in items">
              <v-list-item
                v-show="!search || (search && filterSearch.includes(index))"
                v-if="item.id"
                :key="item.id"
              >
                <template v-slot:default="{ active }">
                  <v-list-item-avatar v-if="jenis == 'Kandidat'">
                    <v-img
                      :alt="`${item.nama} avatar`"
                      :src="fotoUrl(item.id, item)"
                    ></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="item.nama"></v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-icon v-if="!active" color="grey lighten-1">
                      mdi-plus-thick
                    </v-icon>

                    <v-icon v-else color="blue darken-3">
                      mdi-check-bold
                    </v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
          <v-list-item v-show="search && !filterSearch.length">
            <v-list-item-content>
              <v-list-item-title class="text-center"
                >Data tidak ditemukan</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item v-if="items.length < 1">
            <v-list-item-content>
              <v-list-item-title class="text-center"
                >Belum ada data {{ jenis }}</v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-card-actions class="primary justify-end">
          <v-btn
            plain
            color="white"
            @click="$emit('update:dialogModel', false)"
            :disabled="dialogLoading"
          >
            Tutup
          </v-btn>
          <v-btn
            plain
            color="white"
            @click="$emit('simpan')"
            :disabled="dialogLoading"
          >
            <v-progress-circular
              :size="25"
              indeterminate
              color="primary"
              v-if="dialogLoading"
            ></v-progress-circular>
            <div v-else>Oke</div>
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    jenis: String,
    dialogModel: Boolean,
    dialogLoading: Boolean,
    // search: String,
    selected: Array,
    items: Array,
  },
  data() {
    return { search: null, searchClosed: true, filterSearch: [] };
  },
  watch: {
    search(val) {
      if (!val) {
        this.filterSearch = [];
        return;
      }
      const filterIndex = this.items.reduce((prev, curr, i) => {
        if (curr.nama.toLowerCase().search(val.toLowerCase()) > -1)
          prev.push(i);

        return prev;
      }, []);

      this.filterSearch = filterIndex;
    },
  },
  methods: {
    changeSelected(val) {
      this.$emit("update:selected", val);
    },
    tambahSemua() {
      this.$emit(
        "update:selected",
        this.items.map((_, i) => i)
      );
    },
    fotoUrl(id, item) {
      return `${axios.defaults.baseURL}kandidat/foto/${id}?cache=${item.cache}`;
    },
  },
};
</script>

<style scoped>
.expanding-search {
  transition: max-width 0.3s;
}
.expanding-search > .v-input__slot {
  cursor: pointer !important;
}

.expanding-search ::before {
  border-color: transparent !important;
}

.expanding-search.closed {
  max-width: 30px;
}
</style>
