class KandidatModel {
  constructor({ id, nama, foto, file, keterangan, cache }) {
    this.id = id;
    this.nama = nama;
    this.foto = foto;
    this.file = file;
    this.keterangan = keterangan;
    this.cache = cache != undefined ? cache : new Date().getTime();
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
