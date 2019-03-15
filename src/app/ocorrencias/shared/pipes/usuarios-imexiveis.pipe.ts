import {Pipe, PipeTransform} from '@angular/core';

import {ObjectReference, Participante} from '../../../model/transport-objects';

@Pipe({
  name: 'usuariosImexiveis',
})
export class UsuariosImexiveisPipe implements PipeTransform {
  transform(values: Participante[]): ObjectReference[] {
    return values
      ? values.filter((u: Participante) => u.isAutor).map((u: Participante) => u.usuarioRef)
      : [];
  }
}
