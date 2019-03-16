import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';

import {combineLatest, Observable, Subject} from 'rxjs';
import {first, map, takeUntil, tap} from 'rxjs/operators';

import {
  IssueTrackerPagination,
  OcorrenciaStoreFacadeService,
} from '../ocorrencia-facade.service';
import {
  OcorrenciaFormularioComponentData,
  OcorrenciaFormularioComponentTipo,
} from '../ocorrencia-formulario/ocorrencia-formulario-component.service';
import {OcorrenciaComponentService} from './ocorrencia-component.service';

import {
  Evento,
  NovoEventoRequest,
  Unidade,
} from '../../model/transport-objects/';
import {IssueTrackerConfiguration} from '../model/issue-tracker-configuration';

@Component({
  selector: 'app-ocorrencias',
  templateUrl: './ocorrencias.component.html',
  styleUrls: ['./ocorrencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class OcorrenciasComponent implements OnDestroy {
  _config$: Observable<IssueTrackerConfiguration> =
      this._ocorrenciaStoreFacade.getIssueTrackerConfiguration$();

  /** dados de eventos paginados */
  _eventos$: Observable<Evento[]> = this._ocorrenciaStoreFacade.getEventos$();

  /** dados de paginação */
  _paginacao$: Observable<IssueTrackerPagination> =
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

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _activatedRoute: ActivatedRoute, private _router: Router,
              private _ocorrenciaStoreFacade: OcorrenciaStoreFacadeService,
              private _componentService: OcorrenciaComponentService) {
    this._obtemOcorrenciaAPartirDaRota();

    combineLatest(this._paginacao$)
        .pipe(first(), map((_) => _[0]))
        .subscribe((paginacao: IssueTrackerPagination) => {
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

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  /** filtra os eventos existentes */
  _filtraEventos(termo: string | null | undefined) {
    this._ocorrenciaStoreFacade.setTermoDeBuscaEBusca(termo);
  }

  /** escolhe tipo do formulário a ser mostrado */
  _mostraFormularioDeOcorrencia(classificacao:
                                    OcorrenciaFormularioComponentTipo) {
    this._ocorrenciaFormularioComponentTipo = classificacao;

    this._router.navigate(
        ['nova-ocorrencia', this._ocorrenciaFormularioComponentTipo], {
          relativeTo: this._activatedRoute,
        });
  }

  /** atualiza os dados de paginação */
  _atualizaPaginacao(paginacao: IssueTrackerPagination) {
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

    this._ocorrenciaStoreFacade.criaEvento(to);
  }

  /**
   * Analisa a rota, obtém a ocorrência do store e já solicita atualização a
   * partir do banco
   *
   * @private
   * @memberof OcorrenciaDetalhesComponent
   */
  private _obtemOcorrenciaAPartirDaRota() {
    this._activatedRoute.paramMap.pipe(map((p: ParamMap) => (
                                               p.get('tipoNovaOcorrencia') ?
                                                   p.get('tipoNovaOcorrencia') :
                                                   null)),
                                       takeUntil(this._destroy$))
        .subscribe((tipoNovaOcorrencia: OcorrenciaFormularioComponentTipo) => {
          if (tipoNovaOcorrencia) {
            this._ocorrenciaFormularioComponentTipo = tipoNovaOcorrencia;

            this._isCriandoNovaOcorrencia = true;
          } else {
            this._isCriandoNovaOcorrencia = false;
          }
        });
  }
}
