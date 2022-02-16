<template>
  <v-card elevation="2" class="cardRadius">
    <v-card-title>
      <template v-if="!showCustomAksi">
        <v-btn
          v-if="showBtnTambah"
          color="secondary"
          :disabled="roleNotAdmin"
          @click.stop="$emit('tambah')"
        >
          <v-icon left> mdi-plus </v-icon>
          Tambah Data
        </v-btn>

        <slot name="aksi"></slot>
        <v-spacer></v-spacer>
        <v-text-field
          v-if="showSearch"
          v-model="search"
          append-icon="mdi-magnify"
          label="Pencarian"
          single-line
          hide-details
          dense
          outlined
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
              :disabled="!isSelected || loading || roleNotAdmin"
            >
              <v-icon> mdi-account-edit </v-icon>
            </v-btn>
          </template>
          <span>Ubah Daftar</span>
        </v-tooltip>

        <!-- <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="error"
              @click.stop="$emit('tambah')"
              small
              :disabled="!isSelected || loading"
            >
              <v-icon> mdi-account-sync</v-icon>
            </v-btn>
          </template>
          <span>Reset Data</span>
        </v-tooltip>

        <v-spacer></v-spacer> -->

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              color="primary"
              @click.stop="$emit('simpan')"
              small
              :disabled="!isSelected || loading || roleNotAdmin"
            >
              <v-icon small> mdi-content-save-all</v-icon>
            </v-btn>
          </template>
          <span>Simpan Data</span>
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

      <template v-slot:[`item.waktu`]="{ item }">
        {{ formatWaktu(item.waktu) }}
      </template>

      <template v-slot:[`item.foto`]="{ item }">
        <v-avatar size="150" color="grey" class="my-2">
          <img alt="Avatar" :src="fotoUrl(item)" />
          <!-- <cld-image :publicId="`kandidat/${item.foto}`" :version="9999" /> -->
        </v-avatar>
      </template>

      <template v-slot:[`item.fotoKandidat`]="{ item }">
        <v-avatar class="my-2" color="grey">
          <img alt="Avatar" :src="fotoUrl(item)" />
        </v-avatar>
      </template>

      <template v-slot:[`item.jumlah`]="{ item }">
        <p class="font-weight-bold">{{ item.jumlah }} Suara</p>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          class="d-flex justify-center"
          style="width: 120px"
          :color="
            item.status == null ? `warning` : item.status ? `green` : `red`
          "
          dark
          small
        >
          {{
            item.status == null
              ? "Belum di Verifikasi"
              : item.status
              ? "Aktif"
              : "Tidak Aktif"
          }}
        </v-chip>
      </template>

      <template v-slot:[`item.statusVote`]="{ index }">
        <v-chip
          class="d-flex justify-center"
          style="width: 120px"
          :color="
            statusVote[index] == 0
              ? `warning`
              : statusVote[index] == 1
              ? `green`
              : `primary`
          "
          dark
          small
        >
          {{
            statusVote[index] == 0
              ? `Belum Aktif`
              : statusVote[index] == 1
              ? `Aktif`
              : `Selesai`
          }}
        </v-chip>
      </template>

      <template v-slot:[`item.vote_nomor`]="{ item }">
        <v-chip
          class="d-flex justify-center"
          style="width: 100px"
          :color="item.vote_nomor > 0 ? `green` : `red`"
          dark
          small
        >
          {{ item.vote_nomor > 0 ? "Telah Memilih" : "Belum Memilih" }}
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
              :disabled="!index || roleNotAdmin"
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
              :disabled="index == items.length - 1 || roleNotAdmin"
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
              :disabled="roleNotAdmin"
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
              :disabled="roleNotAdmin"
              @click.stop="$emit('hapus', item)"
            >
              mdi-close-box-multiple
            </v-icon>
          </template>
          <span>Hapus Data</span>
        </v-tooltip>
      </template>

      <template v-slot:[`item.verif`]="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              class="mr-2"
              v-bind="attrs"
              v-on="on"
              color="success"
              :disabled="roleNotAdmin"
              @click.stop="$emit('verif', 'terima', item)"
            >
              mdi-checkbox-marked-outline
            </v-icon>
          </template>
          <span>Terima</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-bind="attrs"
              v-on="on"
              color="error"
              :disabled="roleNotAdmin"
              @click.stop="$emit('verif', 'tolak', item)"
            >
              mdi-close-box-outline
            </v-icon>
          </template>
          <span>Tolak</span>
        </v-tooltip>
      </template>

      <template v-slot:top>
        <slot name="modal"></slot>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
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
    showBtnTambah: {
      default: true,
      type: Boolean,
    },
    selectedIndex: Number,
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
    statusVote() {
      return this.items.map((item) => {
        const waktu_mulai = moment(`${item.tanggal_mulai} ${item.jam_mulai}`);
        const waktu_selesai = moment(
          `${item.tanggal_selesai} ${item.jam_selesai}`
        );

        if (waktu_mulai.isAfter(moment())) {
          return 0;
        } else if (moment().isBetween(waktu_mulai, waktu_selesai)) {
          return 1;
        } else if (waktu_selesai.isBefore(moment())) {
          return 2;
        }
      });
    },
    roleNotAdmin() {
      return this.$store.state.authModule.role != "admin";
    },
  },
  methods: {
    selectRow(item, row) {
      row.select(!row.isSelected);

      this.$emit("update:isSelected", !row.isSelected);
      this.$emit("update:selectedIndex", !row.isSelected ? row.index : null);
      this.$emit("update:selectedFilter", !row.isSelected ? item.id : null);
    },

    fotoUrl(item) {
      return `http://res.cloudinary.com/${process.env.VUE_APP_CLOUD_NAME}/image/upload/${item.foto}`;
      // return `https://res.cloudinary.com/rahmanpsg/image/upload/kandidat/${item.foto}?cache=${item.cache}`;
      // return `${axios.defaults.baseURL}kandidat/foto/${id}?cache=${item.cache}`;
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
    formatWaktu(waktu) {
      moment.locale("id");
      return moment(waktu).format("llll");
    },
  },
};
</script>

<style scoped>
.cardRadius {
  border-radius: 0;
}
</style>
