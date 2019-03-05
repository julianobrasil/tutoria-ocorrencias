import {Pipe, PipeTransform} from '@angular/core';

import {Participante, TipoParticipacao} from '../../../model/transport-objects';

@Pipe({
  name: 'filtraResponsaveis',
})
export class FiltraResponsaveisPipe implements PipeTransform {
  transform(values: Participante[], tipoDeParticipacao: TipoParticipacao): Participante[] {
    if (!values) {
      return [];
    }

    if (!tipoDeParticipacao) {
      return values;
    }

    return values.filter((p: Participante) => p.tipoParticipacao === tipoDeParticipacao);
  }
}
