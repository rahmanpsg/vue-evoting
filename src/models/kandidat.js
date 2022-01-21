class KandidatModel {
  constructor({ id, nama, foto, file, keterangan }) {
    this.id = id;
    this.nama = nama;
    this.foto = foto;
    this.file = file;
    this.keterangan = keterangan;
  }

  toFormData() {
    const formData = new FormData();
    formData.append("nama", this.nama);
    formData.append("keterangan", this.keterangan);
    if (this.file != undefined) formData.append("file", this.file);
    return formData;
  }
}

export default KandidatModel;
