export class ServerSideResponse<T, J = string> {
  dado: T;
  isOk = true;
  dadosExtras: J = null;
  httpStatus: number;
  mensagem = '';
}
