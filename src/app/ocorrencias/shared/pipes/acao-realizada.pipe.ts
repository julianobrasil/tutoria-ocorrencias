import {Pipe, PipeTransform} from '@angular/core';
import {Evento, Interacao, TipoAcao} from 'src/app/model/transport-objects';

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
        return 'alterou o tipo';
    }

    return '';
  }
}
