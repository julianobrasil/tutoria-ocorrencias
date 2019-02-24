import {Injectable} from '@angular/core';

import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {first, map, switchMap, tap} from 'rxjs/operators';

import {TutoriaService} from '../model/servicos/dao/tutoria.service';

import {Evento} from '../model/transport-objects';

import {EventoPaginado} from '../model/transport-objects/to';

export interface Paginacao {
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  totalElements?: number;
}

interface OcorrenciaState {
  paginacao: Paginacao;
  termoDeBusca: string;
  eventos: Evento[];
}

@Injectable({
  providedIn: 'root',
})
export class OcorrenciaFacadeService {
  private _store: OcorrenciaState = {
    paginacao: null,
    termoDeBusca: '',
    eventos: [],
  };

  private _store$: BehaviorSubject<{}> = new BehaviorSubject<{}>(this._store);

  constructor(private _tutoriaService: TutoriaService) {}

  /** obtém a paginação corrente */
  getPaginacao(): Observable<Paginacao> {
    return this._store$.asObservable().pipe(map((s: OcorrenciaState) => s.paginacao));
  }

  /** obtém os eventos correntes */
  getEventos(): Observable<Evento[]> {
    return this._store$.asObservable().pipe(map((s: OcorrenciaState) => s.eventos));
  }

  /** configura o atual conjunto de eventos */
  setEventos(eventos: Evento[]) {
    this._store = {
      ...this._store,
      eventos,
    };

    this._store$.next(this._store);
  }

  /** configura a paginação atual */
  setPaginacao(paginacao: Paginacao) {
    this._store = {
      ...this._store,
      paginacao,
    };

    this._store$.next(this._store);
  }

  /** configura a paginação atual e dispara uma busca */
  setPaginacaoEBusca(paginacao?: Paginacao) {
    this._store = {
      ...this._store,
      paginacao: paginacao ? paginacao : this._store.paginacao ? {...this._store.paginacao} : null,
    };

    this._obtemEventosPaginados();
  }

  /** configura o termo de busca atual e dispara uma busca */
  setTermoDeBuscaEBusca(termoDeBusca: string) {
    this._store = {
      ...this._store,
      termoDeBusca,
    };

    this._obtemEventosPaginados();
  }

  private _obtemEventosPaginados(): void {
    this._tutoriaService
      .findEventosByUsuarioLogado(
        this._store.termoDeBusca,
        this._store.paginacao && this._store.paginacao.page ? this._store.paginacao.page : 0,
        this._store.paginacao && this._store.paginacao.pageSize
          ? this._store.paginacao.pageSize
          : 10,
      )
      .subscribe((eventoPaginado: EventoPaginado) => {
        this._store = {
          ...this._store,
          paginacao: {
            ...this._store.paginacao,
            totalElements: eventoPaginado.totalElements,
          },
          eventos: eventoPaginado.content,
        };

        this._store$.next(this._store);
      });
  }

  _setPaginacao(page: number, pageSize?: number, pageSizeOptions?: number[]) {}
}
