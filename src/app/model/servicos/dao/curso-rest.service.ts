import {Injectable} from '@angular/core';

import {Observable, of as observableOf} from 'rxjs';

import {EVENTOS_EXISTENTES} from '../../../../data/eventos';

import * as fromDocuments from '../../transport-objects';
import {
  PaginaDeResposta,
  RespostaDoServicorUtil,
  ServerSideResponse,
} from '../classes';

@Injectable({providedIn: 'root'})
export class CursoRestService {
  /**
   * Obtém os rótulos por parte do nome
   *
   * @param {string} nomeCurso
   * @returns {Observable<fromDocuments.CentroDeCusto[]>}
   * @memberof RotuloRestService
   */
  obtemCursosPorParteDoNome(pageSize?: number, pageNumber?: number,
                            nomeCurso?: string):
      Observable<PaginaDeResposta<fromDocuments.CentroDeCusto>> {
    const map: Map<string, fromDocuments.CentroDeCusto> = new Map();
    EVENTOS_EXISTENTES.forEach((value: fromDocuments.Evento) => {
      value.tutoria.turmas.map((t: fromDocuments.Turma) => t.centroDeCusto)
          .forEach((c: fromDocuments.CentroDeCusto) => {
            if (!c.nomeCurso.toUpperCase().includes(nomeCurso &&
                                                    nomeCurso.toUpperCase())) {
              return;
            }
            const key = c.codigo;
            map.set(key, c);
          });
    });
    const array: fromDocuments.CentroDeCusto[] = [];
    map.forEach((value: fromDocuments.CentroDeCusto) =>
                    value && value.nomeCurso && array.push(value));

    array.sort(
        (a: fromDocuments.CentroDeCusto, b: fromDocuments.CentroDeCusto) =>
            a.nomeCurso.localeCompare(b.nomeCurso, 'pt-br',
                                      {sensitivity: 'base'}));

    const respostaServidor:
        ServerSideResponse<PaginaDeResposta<fromDocuments.CentroDeCusto>> =
            RespostaDoServicorUtil
                .montaPaginaDeRetorno<fromDocuments.CentroDeCusto>([], 0, 0, 0,
                                                                   false, '');

    const resposta: PaginaDeResposta<fromDocuments.CentroDeCusto> =
        respostaServidor.dado;

    const quantidade = array.length;

    resposta.content =
        array.slice(pageNumber * pageSize, pageNumber * pageSize + pageSize);

    resposta.content = JSON.parse(JSON.stringify(resposta.content));
    resposta.totalElements = quantidade;

    return observableOf(JSON.parse(JSON.stringify(resposta)));
  }
}
