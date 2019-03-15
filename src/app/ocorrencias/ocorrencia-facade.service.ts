import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {combineLatest, Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

import * as fromStore from '../../store';
import {Evento, NovoEventoRequest, Unidade} from '../model/transport-objects';

import {IssueTrackerConfiguration} from './model/issue-tracker-configuration';

export interface IssueTrackerPagination {
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  totalElements?: number;
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaStoreFacadeService {
  constructor(private _store$: Store<{}>) {}

  /** preenche as configurações básicas do componente */
  getIssueTrackerConfiguration$(): Observable<IssueTrackerConfiguration> {
    const configuration: IssueTrackerConfiguration =
        new IssueTrackerConfiguration();
    return combineLatest(
               this._store$.pipe(
                   select(fromStore.GERAL.SELECTORS.DADOS_DO_USUARIO_LOGADO
                              .getUsuarioRef)),
               this._store$.pipe(
                   select(fromStore.GERAL.SELECTORS.DADOS_DO_USUARIO_LOGADO
                              .getFuncoesDoUsuario)))
        .pipe(map(([usuarioRef, funcoesDoUsuario]) =>
                      configuration.fillUpUserData(usuarioRef)
                          .fillUpRoles(funcoesDoUsuario)));
  }

  /** envia to para gravação */
  criaEvento(novoEventoRequest: NovoEventoRequest): void {
    this._store$.dispatch(
        new fromStore.DIARIO_DE_TUTORIA.ACTIONS.EVENTO.CriaEventoRun(
            {novoEventoRequest}));
  }

  /** obtém a paginação corrente */
  getPaginacao$(): Observable<IssueTrackerPagination> {
    return this._store$.pipe(
        select(fromStore.DIARIO_DE_TUTORIA.SELECTORS.EVENTO.getPaginacao));
  }

  /** obtém os eventos correntes */
  getEventos$(): Observable<Evento[]> {
    return this._store$.pipe(
        select(fromStore.DIARIO_DE_TUTORIA.SELECTORS.EVENTO.getEventos));
  }

  /** obtém diferença de horas no servidor em millisegundos */
  getDiferencaDeHoraNoServidor$(): Observable<number> {
    return this._store$.pipe(
        select(fromStore.GERAL.SELECTORS.CONFIGURACOES_GERAIS
                   .getDiffHoraLocalServidorMilliSeconds));
  }

  getUnidades$(): Observable<Unidade[]> {
    return this._store$.pipe(
        select(fromStore.GERAL.SELECTORS.UNIDADE.getUnidades));
  }

  /** configura o atual conjunto de eventos */
  setEventos(eventos: Evento[]) {
    this._store$.dispatch(new fromStore.DIARIO_DE_TUTORIA.ACTIONS.EVENTO
                              .ObtemEventosPaginadosSuccess({
                                eventos,
                                totalElements: eventos.length,
                              }));
  }

  /** configura a paginação atual */
  setPaginacao(paginacao: IssueTrackerPagination) {
    this._store$.dispatch(new fromStore.DIARIO_DE_TUTORIA.ACTIONS.EVENTO
                              .ConfiguraDadosDePaginacaoRun({paginacao}));
  }

  /** configura a paginação atual e dispara uma busca */
  setPaginacaoEBusca(paginacao?: IssueTrackerPagination) {
    combineLatest(
        this._store$.pipe(select(
            fromStore.DIARIO_DE_TUTORIA.SELECTORS.EVENTO.getTermoDeBusca)))
        .pipe(first())
        .subscribe(([termoDeBusca]) => this._store$.dispatch(
                       new fromStore.DIARIO_DE_TUTORIA.ACTIONS.EVENTO
                           .ObtemEventosPaginadosRun({
                               termoDeBusca, paginacao,
                           })));
  }

  /** configura o termo de busca atual e dispara uma busca */
  setTermoDeBuscaEBusca(termoDeBusca: string) {
    combineLatest(
        this._store$.pipe(select(
            fromStore.DIARIO_DE_TUTORIA.SELECTORS.EVENTO.getPaginacao)))
        .pipe(first())
        .subscribe(([paginacao]) => this._store$.dispatch(
                       new fromStore.DIARIO_DE_TUTORIA.ACTIONS.EVENTO
                           .ObtemEventosPaginadosRun({
                               termoDeBusca, paginacao,
                           })));
  }
}
