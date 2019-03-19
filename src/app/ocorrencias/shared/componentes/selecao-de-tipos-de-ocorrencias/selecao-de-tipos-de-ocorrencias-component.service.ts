import {Injectable} from '@angular/core';
import {TipoSubtipoInfo} from './tipos-de-ocorrencia-service-adapter';

@Injectable({providedIn: 'root'})
export class SelecaoDeTiposDeOcorrenciaComponentService {
  /**
   * Adiciona, no início do vetor tipos, os tiposEscolhidos,
   * em ordem alfabética.
   *
   * @param {TipoSubtipoInfo[]} tipos
   * @param {TipoSubtipoInfo[]} tiposEscolhidos
   * @memberof SelecaoDeTiposDeOcorrenciaComponentService
   */
  _adicionaTiposDeOcorrenciaSeNaoExistir(
    tipos: TipoSubtipoInfo[],
    tiposEscolhidos: TipoSubtipoInfo[],
  ): void {
    tiposEscolhidos.forEach((pe: TipoSubtipoInfo) => {
      const index = tipos.findIndex(
        (p: TipoSubtipoInfo) => pe.nomeTipo === p.nomeTipo && pe.nomeSubtipo === p.nomeSubtipo,
      );
      if (index > -1) {
        tipos.splice(index, 1);
      }
    });

    tiposEscolhidos.sort((a: TipoSubtipoInfo, b: TipoSubtipoInfo) =>
      a.nomeTipo.localeCompare(b.nomeTipo, 'pt-br', {sensitivity: 'base'}),
    );

    tipos.splice(0, 0, ...tiposEscolhidos);
  }
}
