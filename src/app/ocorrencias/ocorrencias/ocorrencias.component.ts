import {ChangeDetectionStrategy, Component} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

import {ClassificacaoEvento, Evento, NovoEventoRequest, Unidade} from '../../model/transport-objects/';
import {OcorrenciaStoreFacadeService, Paginacao} from '../ocorrencia-facade.service';
import {OcorrenciaFormularioComponentData, OcorrenciaFormularioComponentTipo} from '../ocorrencia-formulario/ocorrencia-formulario-component.service';

import {OcorrenciaComponentService} from './ocorrencia-component.service';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.component.html',
  styleUrls: ['./ocorrencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciasComponent {
  /** dados de eventos paginados */
  _eventos$: Observable<Evento[]> = this._ocorrenciaStoreFacade.getEventos$();

  /** dados de paginação */
  _paginacao$: Observable<Paginacao> =
      this._ocorrenciaStoreFacade.getPaginacao$();

  /** quando estiver criando nova ocorrência, é true */
  _isCriandoNovaOcorrencia = false;

  /** diferença de hora local para hora no servidor servidor */
  _diferencaDeHoraNoServidor$ =
      this._ocorrenciaStoreFacade.getDiferencaDeHoraNoServidor$();

  /** unidades disponíveis */
  _unidades$: Observable<Unidade[]> =
      this._ocorrenciaStoreFacade.getUnidades$();

  /** tipo de formulário */
  _ocorrenciaFormularioComponentTipo: OcorrenciaFormularioComponentTipo;

  constructor(
      private _ocorrenciaStoreFacade: OcorrenciaStoreFacadeService,
      private _componentService: OcorrenciaComponentService) {
    combineLatest(this._paginacao$)
        .pipe(
            first(),
            map((_) => _[0]),
            )
        .subscribe((paginacao: Paginacao) => {
          if (!paginacao) {
            this._ocorrenciaStoreFacade.setPaginacao({
              page: 0,
              pageSize: 10,
              pageSizeOptions: [5, 10, 20, 50],
            });
          }

          this._ocorrenciaStoreFacade.setTermoDeBuscaEBusca('');
        });
  }

  /** filtra os eventos existentes */
  _filtraEventos(termo: string|null|undefined) {
    this._ocorrenciaStoreFacade.setTermoDeBuscaEBusca(termo);
  }

  /** escolhe tipo do formulário a ser mostrado */
  _mostraFormularioDeOcorrencia(classificacao:
                                    OcorrenciaFormularioComponentTipo) {
    this._ocorrenciaFormularioComponentTipo = classificacao;

    this._isCriandoNovaOcorrencia = true;
  }

  /** atualiza os dados de paginação */
  _atualizaPaginacao(paginacao: Paginacao) {
    this._ocorrenciaStoreFacade.setPaginacaoEBusca(paginacao);
  }

  /**
   * Inicia processo de gravação de um novo evento
   *
   * @param {OcorrenciaFormularioComponentData} dados
   * @memberof OcorrenciasComponent
   */
  _gravaOcorrencia(dados: OcorrenciaFormularioComponentData) {
    const to: NovoEventoRequest = new NovoEventoRequest();

    to.importFromDadosDeFormularioDeOcorrencia(dados);

    // completa propridades faltantes de texto
    this._componentService.complementaDadosDeTexto(to.textoFormatado);

    console
        .log({to})

            this._ocorrenciaStoreFacade.criaEvento(to);
  }
}
