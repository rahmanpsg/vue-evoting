<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogAksi"
          :headers="headers"
          :items="items"
          itemKey="id"
          sortBy="id"
          :loading="loading"
          :showSelect="true"
          :selectedIndex.sync="selectedIndex"
          :selectedFilter.sync="selectedDaftarVote"
          :isSelected.sync="isSelected"
        >
          <template v-slot:modal>
            <DialogForm
              :dialog="dialog"
              :loading="dialogLoading"
              :formTitle="formTitle"
              :formValid="valid"
              @closeDialog="closeDialog"
              @simpan="simpan"
            >
              <template v-slot:form>
                <!-- <v-form ref="form" v-model="valid" lazy-validation> -->
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editedItem.nama"
                      label="Nama"
                      :rules="[(v) => !!v || 'Nama tidak boleh kosong']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-textarea
                      v-model="editedItem.keterangan"
                      label="Keterangan"
                      :rules="[(v) => !!v || 'Keterangan tidak boleh kosong']"
                    ></v-textarea>
                  </v-col>

                  <v-col cols="6" sm="6" md="6">
                    <v-menu
                      ref="menuTanggalMulai"
                      v-model="menuTanggalMulai"
                      :close-on-content-click="false"
                      :return-value.sync="editedItem.tanggal_mulai"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.tanggal_mulai"
                          label="Tanggal Mulai"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="[
                            (v) => !!v || 'Tanggal mulai tidak boleh kosong',
                          ]"
                          required
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.tanggal_mulai"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menuTanggalMulai = false"
                        >
                          Tutup
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.menuTanggalMulai.save(
                              editedItem.tanggal_mulai
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <v-menu
                      ref="menuJamMulai"
                      v-model="menuJamMulai"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedItem.jam_mulai"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.jam_mulai"
                          label="Jam Mulai"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="[
                            (v) => !!v || 'Jam mulai tidak boleh kosong',
                          ]"
                          required
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuJamMulai"
                        v-model="editedItem.jam_mulai"
                        full-width
                        @click:minute="
                          $refs.menuJamMulai.save(editedItem.jam_mulai)
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>

                  <v-col cols="6" sm="6" md="6">
                    <v-menu
                      ref="menuTanggalSelesai"
                      v-model="menuTanggalSelesai"
                      :close-on-content-click="false"
                      :return-value.sync="editedItem.tanggal_selesai"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.tanggal_selesai"
                          label="Tanggal Selesai"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="[
                            (v) => !!v || 'Tanggal selesai tidak boleh kosong',
                          ]"
                          required
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="editedItem.tanggal_selesai"
                        no-title
                        scrollable
                      >
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="menuTanggalSelesai = false"
                        >
                          Tutup
                        </v-btn>
                        <v-btn
                          text
                          color="primary"
                          @click="
                            $refs.menuTanggalSelesai.save(
                              editedItem.tanggal_selesai
                            )
                          "
                        >
                          OK
                        </v-btn>
                      </v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="6" sm="6" md="6">
                    <v-menu
                      ref="menuJamSelesai"
                      v-model="menuJamSelesai"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="editedItem.jam_selesai"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="editedItem.jam_selesai"
                          label="Jam Selesai"
                          prepend-icon="mdi-clock-time-four-outline"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="[
                            (v) => !!v || 'Jam selesai tidak boleh kosong',
                          ]"
                          required
                        ></v-text-field>
                      </template>
                      <v-time-picker
                        v-if="menuJamSelesai"
                        v-model="editedItem.jam_selesai"
                        full-width
                        @click:minute="
                          $refs.menuJamSelesai.save(editedItem.jam_selesai)
                        "
                      ></v-time-picker>
                    </v-menu>
                  </v-col>
                </v-row>
                <!-- </v-form> -->
              </template>
            </DialogForm>
          </template>
        </Table>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <Table
          @tambah="dialogKandidat = true"
          @simpan="simpanKandidat"
          @up="up"
          @down="down"
          :headers="headersKandidat"
          :items.sync="itemListKandidat"
          itemKey="id"
          sortBy="nomor"
          :loading="loadingKandidat"
          :showSearch="false"
          :showCustomAksi="true"
          :hideFooter="true"
          :isSelected="isSelected"
        >
          <template v-slot:modal>
            <DialogCustom
              jenis="Kandidat"
              @simpan="tutupModalKandidat"
              :dialogModel.sync="dialogKandidat"
              :dialogLoading="dialogLoading"
              :selected.sync="selectedKandidat"
              :items="itemsKandidat"
            />
          </template>
        </Table>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <Table
          @tambah="dialogPemilih = true"
          @simpan="simpanPemilih"
          :headers="headersPemilih"
          :items.sync="itemListPemilih"
          itemKey="id"
          sortBy="nama"
          :loading="loadingPemilih"
          :showSearch="false"
          :showCustomAksi="true"
          :hideFooter="true"
          :isSelected="isSelected"
        >
          <template v-slot:modal>
            <DialogCustom
              jenis="Pemilih"
              @simpan="tutupModalPemilih"
              :dialogModel.sync="dialogPemilih"
              :dialogLoading="dialogLoading"
              :selected.sync="selectedPemilih"
              :items="itemsPemilih"
            />
          </template>
        </Table>
      </v-col>
    </v-row>
    <DialogAksi
      :dialog="dialogDelete"
      :dialogLoading="dialogLoading"
      title="Anda yakin untuk menghapus data ini?"
      @submit="hapus"
      @closeDialog="closeDialog"
    />

    <v-snackbar
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
    </v-snackbar>
  </v-container>
</template>

<script>
import Table from "@/components/Table.vue";
import DialogForm from "@/components/DialogForm.vue";
import DialogCustom from "@/components/DialogCustom.vue";
import DialogAksi from "@/components/DialogAksi.vue";
import { mapState, mapActions } from "vuex";

import DaftarVoteModel from "@/models/daftarVote";

export default {
  components: {
    Table,
    DialogForm,
    DialogCustom,
    DialogAksi,
  },
  data() {
    return {
      loading: true,
      loadingKandidat: true,
      loadingPemilih: true,
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Nama Vote", value: "nama" },
        { text: "Keterangan", value: "keterangan" },
        { text: "Tanggal", value: "tanggal" },
        { text: "Status", value: "status" },
        { text: "Aksi", value: "aksi", sortable: false },
      ],
      headersKandidat: [
        { text: "Nomor Urut", value: "nomor" },
        { text: "Foto Kandidat", value: "fotoKandidat" },
        { text: "Nama Kandidat", value: "nama" },
        { text: "Aksi", value: "aksiKandidat" },
      ],
      headersPemilih: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "index",
        },
        { text: "Nama Pemilih", value: "nama" },
        { text: "Status", value: "vote_nomor" },
      ],
      showPassword: false,
      itemListKandidat: [],
      itemListPemilih: [],
      menuTanggalMulai: false,
      menuTanggalSelesai: false,
      menuJamMulai: false,
      menuJamSelesai: false,
      selectedIndex: null,
      selectedDaftarVote: null,
      isSelected: false,
      dialogKandidat: false,
      dialogPemilih: false,
      selectedKandidat: [],
      selectedPemilih: [],
    };
  },
  async created() {
    // cek jika data state telah diload
    let requestPromise = [];

    if (!this.items.length) requestPromise.push(this.getAll());

    if (!this.itemsKandidat.length)
      requestPromise.push(this.$store.dispatch("kandidatModule/getAll"));

    if (!this.itemsPemilih.length)
      requestPromise.push(this.$store.dispatch("pemilihModule/getAll"));

    await Promise.all(requestPromise);

    await this.$store.commit("crudModule/initCrud", {
      model: DaftarVoteModel,
      items: this.items,
      moduleName: "daftarVoteModule",
    });

    this.loading = false;
    this.loadingKandidat = false;
    this.loadingPemilih = false;
  },
  computed: {
    ...mapState("daftarVoteModule", ["items"]),
    ...mapState("kandidatModule", { itemsKandidat: "items" }),
    // ...mapState("pemilihModule", { itemsPemilih: "items" }),
    ...mapState("crudModule", [
      "valid",
      "dialog",
      "dialogLoading",
      "dialogDelete",
      "editedIndex",
      "editedItem",
      "response",
    ]),
    formTitle() {
      return this.editedIndex === -1
        ? "Tambah Data Daftar Vote"
        : "Edit Data Daftar Vote";
    },
    itemsPemilih() {
      return this.$store.getters["pemilihModule/pemilihVerif"];
    },
  },
  watch: {
    selectedDaftarVote(val) {
      const item = this.items.find((item) => item.id == val);
      if (item) {
        this.itemListKandidat = item.list_kandidat.map((kandidat) => {
          return {
            ...kandidat,
            ...this.itemsKandidat.find((k) => k.id == kandidat.id),
          };
        });

        this.itemListPemilih = item.list_pemilih.map((pemilih) => {
          return {
            ...pemilih,
            ...this.itemsPemilih.find((k) => k.id == pemilih.id),
          };
        });
      } else {
        this.itemListKandidat = [];
        this.itemListPemilih = [];
      }
    },
    itemListKandidat(val) {
      const listIDKandidat = val.map((k) => k.id);

      const selected = this.itemsKandidat.reduce((prev, curr, i) => {
        if (listIDKandidat.includes(curr.id)) prev.push(i);

        return prev;
      }, []);

      this.selectedKandidat = selected;
    },
    itemListPemilih(val) {
      const listIDPemilih = val.map((k) => k.id);

      const selected = this.itemsPemilih.reduce((prev, curr, i) => {
        if (listIDPemilih.includes(curr.id)) prev.push(i);

        return prev;
      }, []);

      this.selectedPemilih = selected;
    },
  },
  methods: {
    ...mapActions("daftarVoteModule", ["getAll", "simpanDataList"]),
    ...mapActions("crudModule", [
      "tambah",
      "edit",
      "hapus",
      "simpan",
      "showDialogAksi",
      "closeDialog",
    ]),
    tutupModalKandidat() {
      this.itemListKandidat = this.selectedKandidat.map((v, n) => {
        return { ...this.itemsKandidat.find((_, i) => i == v), nomor: n + 1 };
      });

      this.dialogKandidat = false;
    },
    tutupModalPemilih() {
      this.itemListPemilih = this.selectedPemilih.map((v) => {
        return { ...this.itemsPemilih.find((_, i) => i == v), vote_nomor: -1 };
      });

      this.dialogPemilih = false;
    },
    async simpanKandidat() {
      this.loadingKandidat = true;

      const res = await this.simpanDataList({
        id: this.selectedDaftarVote,
        index: this.selectedIndex,
        items: this.itemListKandidat,
        jenis: "kandidat",
      });

      this.loadingKandidat = false;

      this.cekResponse(res);
    },
    async simpanPemilih() {
      this.loadingPemilih = true;

      const res = await this.simpanDataList({
        id: this.selectedDaftarVote,
        index: this.selectedIndex,
        items: this.itemListPemilih,
        jenis: "pemilih",
      });

      this.loadingPemilih = false;
      this.cekResponse(res);
    },
    cekResponse(res) {
      let text = res.data.message;
      let type = "success";
      if (res.status != 200 && res.status != 201 && res.status != 202) {
        text = res.data.detail;
        type = "error";
      }

      this.$store.commit("crudModule/setResponse", {
        show: true,
        text,
        type,
      });
    },
    up(index) {
      //fungsi untuk menaikkan nomor urut kandidat
      this.itemListKandidat[index].nomor--;
      this.itemListKandidat[index - 1].nomor++;

      this.swap(this.itemListKandidat, index, index - 1);
    },
    down(index) {
      //fungsi untuk menurunkan nomor urut kandidat
      this.itemListKandidat[index].nomor++;
      this.itemListKandidat[index + 1].nomor--;

      this.swap(this.itemListKandidat, index, index + 1);
    },
    swap(arr, from, to) {
      arr.splice(from, 1, arr.splice(to, 1, arr[from])[0]);
    },
  },
};
</script>
