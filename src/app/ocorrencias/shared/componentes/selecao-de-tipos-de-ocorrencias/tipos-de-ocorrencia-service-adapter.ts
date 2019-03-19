import {InjectionToken} from '@angular/core';

import {Observable} from 'rxjs';

export interface TipoSubtipoInfo {
  nomeTipo: string;
  nomeSubtipo: string;
  descricaoTipo: string;
  descricaoSubtipo: string;
}

/** Token para injetar o serviço de obtenção de pessoas */
export const TIPO_DE_OCORRENCIA_SERVICE_ADAPTER:
    InjectionToken<TipoDeOcorrenciaServiceAdapter> =
        new InjectionToken<TipoDeOcorrenciaServiceAdapter>(
            'Adapter para tipos de ocorrência');

export interface TipoDeOcorrenciaServiceAdapter {
  /**
   * Este método deve devolver um array de TipoSubptipoInfo, contendo informações
   * de tipos e subtipos disponíveis por parte do nome do tipo ou subjetipo (de
   * forma paginada).
   *
   * @param {number} pagina
   * @param {number} tamanhoDaPagina
   * @param {string} valor nome ou parte do nome do curso
   * @returns {Observable<TipoSubtipoInfo[]>}
   * @memberof TipoDeOcorrenciaServiceAdapter
   */
  obtemCentroDeCustosPorNomeDeTipoOuSubtipoDeOcorrencia(
      pagina: number, tamanhoDaPagina: number,
      valor: string): Observable<TipoSubtipoInfo[]>;
}
