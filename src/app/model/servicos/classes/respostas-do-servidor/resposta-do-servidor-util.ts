import {PaginaDeResposta} from './pagina-de-resposta';
import {ServerSideResponse} from './server-side-response';

export class RespostaDoServicorUtil {
  static montaDadoDeRetorno<T, J = string>(
    dado: T,
    isOk: boolean,
    mensagem?: string,
    dadosExtras?: J,
  ): ServerSideResponse<T, J> {

    const retorno: ServerSideResponse<T, J> =
      new ServerSideResponse<T, J>();

    // já é padrão mas por via das dúvidas
    retorno.isOk = isOk;
    retorno.dado = dado ? JSON.parse(JSON.stringify(dado)) as T : null;
    retorno.dadosExtras = dadosExtras ? dadosExtras : null;
    retorno.mensagem = mensagem ? mensagem : 'Erro';

    return retorno;
  }

  static montaPaginaDeRetorno<T>(
    dado: T[],
    numeroDePaginasNoBanco: number,
    totalDeElementosNoBanco,
    numeroDeElementosNestaPagina,
    isOk: boolean,
    mensagem?: string,
  ): ServerSideResponse<PaginaDeResposta<T>> {
    const pagina: PaginaDeResposta<T> =
      new PaginaDeResposta<T>(
        dado,
        numeroDePaginasNoBanco,
        totalDeElementosNoBanco,
        false,
        0,
        0,
        '',
        numeroDeElementosNestaPagina,
        false);

    return RespostaDoServicorUtil.montaDadoDeRetorno<PaginaDeResposta<T>>(pagina, isOk, mensagem);
  }
}
