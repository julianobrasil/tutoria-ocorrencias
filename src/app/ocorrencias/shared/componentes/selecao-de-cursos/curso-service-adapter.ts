import {InjectionToken} from '@angular/core';

import {Observable} from 'rxjs';

import {CentroDeCusto} from '@model-objects';

/** Token para injetar o serviço de obtenção de pessoas */
export const CURSO_SERVICE_ADAPTER:
    InjectionToken<CursoServiceAdapter> =
        new InjectionToken<CursoServiceAdapter>(
            'CENTRO_DE_CUSTO_SERVICE_ADAPTER');

export interface CursoServiceAdapter {
  /**
   * Este método deve devolver um array de CentroDeCusto, contendo informações
   * de cursos disponíveis por parte do nome (de forma paginada)
   *
   * @param {number} pagina
   * @param {number} tamanhoDaPagina
   * @param {string} valor nome ou parte do nome do curso
   * @returns {Observable<CentroDeCusto[]>}
   * @memberof CursoServiceAdapter
   */
  obtemCentroDeCustosPorNomeDeCurso(
      pagina: number, tamanhoDaPagina: number,
      valor: string): Observable<CentroDeCusto[]>;
}
