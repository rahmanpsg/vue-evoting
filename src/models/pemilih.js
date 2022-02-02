class PemilihModel {
  constructor({
    id,
    nik,
    nama,
    username,
    password,
    alamat,
    status,
    face_recognition,
  }) {
    this.id = id;
    this.nik = nik;
    this.nama = nama;
    this.username = username;
    this.password = password;
    this.alamat = alamat;
    this.status = status;
    this.face_recognition = face_recognition;
  }
}

export default PemilihModel;
