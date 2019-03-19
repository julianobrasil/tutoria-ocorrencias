import {Pipe, PipeTransform} from '@angular/core';

import {ObjectReference, Participante} from '@model-objects';

@Pipe({
  name: 'participantesToObjectReferences',
})
export class ParticipantesToObjectReferencesPipe implements PipeTransform {
  transform(values: Participante[]): ObjectReference[] {
    return !values || !values.length ? [] : values.map((p: Participante) =>
                                                           p.usuarioRef);
  }
}
