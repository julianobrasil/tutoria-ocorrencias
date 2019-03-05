import {Pipe, PipeTransform} from '@angular/core';

import memo from 'memo-decorator';

@Pipe({
  name: 'numeroDeParticipantes',
})
export class NumeroDeParticipantesPipe implements PipeTransform {
  @memo()
  transform(quantidade: number, label?: {singular: string; plural: string}): string {
    return !quantidade
      ? 'Nenhum Participante'
      : quantidade === 1
      ? `1 ${label && label.singular ? label.singular : 'Participante'}`
      : `${quantidade} ${label && label.plural ? label.plural : 'Participantes'}`;
  }
}
