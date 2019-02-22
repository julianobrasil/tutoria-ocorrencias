export class UserData {
  constructor(
    public nomeUsuario?: string,
    public apelido?: string,
    public email?: string,
    public isLoggedIn?: boolean,
  ) {
    if (!nomeUsuario) {
      this.nomeUsuario = '';
    }
    if (!apelido) {
      this.apelido = '';
    }
    if (!email) {
      this.email = '';
    }
    if (!isLoggedIn) {
      this.isLoggedIn = false;
    }
  }
}
