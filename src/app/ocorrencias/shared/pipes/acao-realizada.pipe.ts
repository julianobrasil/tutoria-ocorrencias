import {Pipe, PipeTransform} from '@angular/core';

import {
  HistoricoAuditoriaAcao,
  Interacao,
  TipoAcao,
} from '../../../model/transport-objects';

@Pipe({name: 'acaoRealizada'})
export class AcaoRealizadaPipe implements PipeTransform {
  transform(value: Interacao): string {
    if (!value) {
      return '';
    }

    switch (value.historicoInteracoes[0].tipoAcao) {
      case TipoAcao.ENCERRA_OCORRENCIA:
        return 'encerrou esta ocorrência';
      case TipoAcao.REABRE_OCORRENCIA:
        return 'reabriu esta ocorrência';
      case TipoAcao.ALTERA_TIPO:
        return 'alterou o tipo de ' +
               this._descricaoDeAlteracao(
                   value.historicoInteracoes[0].auditoriaAcao);
      case TipoAcao.ALTERA_LOCAL:
        return 'alterou o local de ' +
               this._descricaoDeAlteracao(
                   value.historicoInteracoes[0].auditoriaAcao);
      case TipoAcao.ALTERA_TITULO:
        return 'alterou o título de ' +
               this._descricaoDeAlteracao(
                   value.historicoInteracoes[0].auditoriaAcao);
    }

    return '';
  }

  /** monta mensagem de alteração do valor antigo para o novo */
  private _descricaoDeAlteracao(auditoriaAcao: HistoricoAuditoriaAcao) {
    return `
      <span class="texto-normal-negrito">
        <strike>
          ${auditoriaAcao.valorAntigo}
        </strike>
      </span>&nbsp;
    para
      <span class="texto-normal-negrito">
        ${auditoriaAcao.valorCorrente}
      </span>
    `;
  }
}
