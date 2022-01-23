class DaftarVoteModel {
  constructor({
    id,
    nama,
    keterangan,
    tanggal_mulai,
    tanggal_selesai,
    jam_mulai,
    jam_selesai,
    list_kandidat,
    list_pemilih,
    status,
  }) {
    this.id = id;
    this.nama = nama;
    this.keterangan = keterangan;
    this.tanggal_mulai = tanggal_mulai;
    this.tanggal_selesai = tanggal_selesai;
    this.jam_mulai = jam_mulai;
    this.jam_selesai = jam_selesai;
    this.list_kandidat = list_kandidat;
    this.list_pemilih = list_pemilih;
    this.status = status;
  }
}

export default DaftarVoteModel;
