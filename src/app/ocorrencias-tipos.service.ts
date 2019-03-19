// tslint:disable: max-line-length
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {first, map} from 'rxjs/operators';

import {select, Store} from '@ngrx/store';

import * as fromStore from '../store';

// tslint:disable-next-line: no-implicit-dependencies
import {TipoEvento} from '@model-objects';
import {
  TipoDeOcorrenciaServiceAdapter,
  TipoSubtipoInfo,
} from './ocorrencias/shared/componentes/selecao-de-tipos-de-ocorrencias/tipos-de-ocorrencia-service-adapter';
// tslint:enable: max-line-length

@Injectable({providedIn: 'root'})
export class OcorrenciasTiposAdapterService implements
    TipoDeOcorrenciaServiceAdapter {
  constructor(private _store: Store<{}>) {}

  /**
   * Obtém tipos e subtipos existentes
   *
   * @param {string} partOfName
   * @returns {Observable<RotuloDoEvento[]>}
   * @memberof OcorrenciasRotulosAdapterService
   */
  obtemCentroDeCustosPorNomeDeTipoOuSubtipoDeOcorrencia(
      page: number, pageSize: number,
      partOfName: string): Observable<TipoSubtipoInfo[]> {
    return this._store.pipe(
        select(fromStore.GERAL.SELECTORS.TIPO_EVENTO.getTiposDeEventosByName,
               {page, pageSize, partOfName}),
        map((ts: TipoEvento[]): TipoSubtipoInfo[] => {
          const tipoSubtipoInfo: TipoSubtipoInfo[] = [];

          ts.sort((a, b) => a.descricao.localeCompare(b.descricao, 'pt-br',
                                                      {sensitivity: 'base'}));

          const jaAdicionados: Set<string> = new Set<string>();
          partOfName = partOfName.toUpperCase();
          for (const t of ts) {
            t.listaSubTipoEvento.sort(
                (a, b) => a.descricao.localeCompare(b.descricao, 'pt-br',
                                                    {sensitivity: 'base'}));
            for (const s of t.listaSubTipoEvento) {
              // O tipo pode estar aqui por causa de um subtipo apenas, e, não
              // por causa de todos eles. Por isso é preciso verificar se o
              // termo digitado consta no tipo o subtipo
              if (t.descricao.toUpperCase().includes(partOfName) ||
                  s.descricao.toUpperCase().includes(partOfName)) {
                const key = `${t.nomeTipoEvento}::${s.nomeSubTipoEvento}`;
                if (jaAdicionados.has(key)) {
                  continue;
                }
                jaAdicionados.add(key);
                tipoSubtipoInfo.push({
                  nomeTipo: t.nomeTipoEvento,
                  nomeSubtipo: s.nomeSubTipoEvento,
                  descricaoTipo: t.descricao,
                  descricaoSubtipo: s.descricao,
                });
              }
            }
          }

          return tipoSubtipoInfo;
        }), first());
  }
}
