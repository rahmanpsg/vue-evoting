class UserModel {
  constructor({ id, nama, username, password, role, status }) {
    this.id = id;
    this.nama = nama;
    this.username = username;
    this.password = password;
    this.role = role;
    this.status = status;
  }
}

export default UserModel;
