import {Injectable} from '@angular/core';

import {AuthService} from '../../../auth/auth.service';
import {ImodbService} from '../../../model/servicos/imodb.service';

import {ClassificacaoEvento, Evento} from '../../../model/transport-objects';
import {Responsavel} from '../../../model/transport-objects/';
import {ObjectReference} from '../../model';

export interface CorDoParticipante {
  usuarioRef: ObjectReference;
  codigoCorHexadecimal: string;
  isTextoDoAvatarBranco: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaDetalhesConfiguracoesComponentService {
  constructor(private _authService: AuthService, private _imodb: ImodbService) {
  }

  /** retorna o serviço Imodb */
  getImodbService(): ImodbService {
    return this._imodb;
  }

  /** verifica se o usuário tem permissão para excluir o evento */
  temPermissaoParaExcluirEvento(evt: Evento): boolean {
    const emailLogado = this._authService.email;

    const isAutor = evt && evt.autorEvento.code === emailLogado;

    const isAdministrador = this._authService.isUsuarioLogadoAdministrador();

    const isQualidade = this._authService.isUsuarioLogadoQualidade();

    const isDiretoria = this._authService.isUsuarioLogadoDiretoria();

    const isTutoria = evt &&
        (evt.classificacaoEvento === ClassificacaoEvento.TUTORIA_GERAL ||
         evt.classificacaoEvento === ClassificacaoEvento.TUTORIA_TUTOR);

    return isAdministrador || isAutor ||
        (isTutoria && (isQualidade || isDiretoria));
  }

  /** verifica se o usuário tem permissão para alterar o tipo de evento */
  temPermissaoParaAlterarTipoDeEvento(evt: Evento): boolean {
    const emailLogado = this._authService.email;

    const isAutor = evt && evt.autorEvento.code === emailLogado;

    const isAdministrador = this._authService.isUsuarioLogadoAdministrador();

    const isQualidade = this._authService.isUsuarioLogadoQualidade();

    const isDiretoria = this._authService.isUsuarioLogadoDiretoria();

    const isResponsavel = evt &&
        evt.responsaveis.some((r: Responsavel) => r.email === emailLogado);

    const isTutoria = evt &&
        (evt.classificacaoEvento === ClassificacaoEvento.TUTORIA_GERAL ||
         evt.classificacaoEvento === ClassificacaoEvento.TUTORIA_TUTOR);

    return (
        isAdministrador || isAutor || isResponsavel ||
        (isTutoria && (isQualidade || isDiretoria)));
  }
}
