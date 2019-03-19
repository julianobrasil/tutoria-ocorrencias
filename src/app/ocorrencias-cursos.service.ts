// tslint:disable: max-line-length
import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {CursoRestService} from './model/servicos/dao/curso-rest.service';

import {CursoServiceAdapter} from './ocorrencias/shared/componentes/selecao-de-cursos/curso-service-adapter';

import {PaginaDeResposta} from './model/servicos/classes';
import {CentroDeCusto} from './model/transport-objects';
// tslint:enable: max-line-length

@Injectable({providedIn: 'root'})
export class OcorrenciasCursosAdapterService implements CursoServiceAdapter {
  constructor(private _cursoService: CursoRestService) {}

  /**
   * Obtém Centros de Custo
   *
   * @param {string} valor
   * @returns {Observable<RotuloDoEvento[]>}
   * @memberof OcorrenciasRotulosAdapterService
   */
  obtemCentroDeCustosPorNomeDeCurso(
    pagina: number,
    tamanhoDaPagina: number,
    valor: string,
  ): Observable<CentroDeCusto[]> {
    return this._cursoService
      .obtemCursosPorParteDoNome(pagina, tamanhoDaPagina, valor)
      .pipe(map((p: PaginaDeResposta<CentroDeCusto>) => p.content));
  }
}
