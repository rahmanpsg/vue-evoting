<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <Table
          @tambah="tambah"
          @edit="edit"
          @hapus="showDialogHapus"
          :headers="headers"
          :items="items"
          itemKey="id"
          sortBy="id"
          :loading="loading"
          :dialogDelete="dialogDelete"
          :showSelect="true"
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

            <DialogCustom
              :dialog="dialogDelete"
              :dialogLoading="dialogLoading"
              title="Anda yakin untuk menghapus data ini?"
              @hapus="hapus"
              @closeDialog="closeDialog"
            />
          </template>
        </Table>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <Table
          ref="tableKandidat"
          @up="up"
          @down="down"
          @hapus="showDialogHapus"
          :headers="headersKandidat"
          :items.sync="itemListKandidat"
          itemKey="id"
          sortBy="nomor"
          :loading="loadingKandidat"
          :dialogDelete="dialogDelete"
          :showSearch="false"
          :showCustomAksi="true"
          :hideFooter="true"
          :isSelected="isSelected"
        >
        </Table>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <Table
          @hapus="showDialogHapus"
          :headers="headersPemilih"
          :items="itemsListPemilih"
          itemKey="id"
          sortBy="nomor"
          :loading="loadingPemilih"
          :dialogDelete="dialogDelete"
          :showSelect="true"
          :showSearch="false"
          :showCustomAksi="true"
          :hideFooter="true"
          :isSelected="isSelected"
        >
        </Table>
      </v-col>
    </v-row>
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
import { mapState, mapActions } from "vuex";

import DaftarVoteModel from "@/models/daftarVote";

export default {
  components: {
    Table,
    DialogForm,
    DialogCustom,
  },
  data() {
    return {
      loading: true,
      loadingKandidat: false,
      loadingPemilih: false,
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
      ],
      showPassword: false,
      itemListKandidat: [],
      itemsListPemilih: [],
      menuTanggalMulai: false,
      menuTanggalSelesai: false,
      menuJamMulai: false,
      menuJamSelesai: false,
      selectedDaftarVote: null,
      isSelected: false,
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
  },
  computed: {
    ...mapState("daftarVoteModule", ["items"]),
    ...mapState("kandidatModule", { itemsKandidat: "items" }),
    ...mapState("pemilihModule", { itemsPemilih: "items" }),
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
    // itemListKandidat() {
    //   //   console.log(this.selectedDaftarVote);
    //   return [];
    // },
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

        this.itemListPemilih = item.list_kandidat.map((pemilih) => {
          return {
            ...pemilih,
            ...this.itemsPemilih.find((k) => k.id == pemilih.id),
          };
        });
      } else {
        this.itemListKandidat = [];
        this.itemsListPemilih = [];
      }
    },
  },
  methods: {
    ...mapActions("daftarVoteModule", ["getAll"]),
    ...mapActions("crudModule", [
      "tambah",
      "edit",
      "hapus",
      "simpan",
      "showDialogHapus",
      "closeDialog",
    ]),
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
