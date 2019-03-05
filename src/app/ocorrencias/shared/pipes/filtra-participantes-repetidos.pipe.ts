import {Pipe, PipeTransform} from '@angular/core';

import {Participante} from '../../../model/transport-objects';

@Pipe({
  name: 'filtraParticipantesRepetidos',
})
export class FiltraParticipantesRepetidosPipe implements PipeTransform {
  transform(values: Participante[]): Participante[] {
    if (!values || !values.length) {
      return [];
    }

    const uniqueValues: Map<string, Participante> = new Map<string, Participante>();

    values.forEach((p: Participante) => uniqueValues.set(p.usuarioRef.code, p));

    return Array.from(uniqueValues.values());
  }
}
