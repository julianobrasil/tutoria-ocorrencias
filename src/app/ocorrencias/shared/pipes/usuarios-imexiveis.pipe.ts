import {Pipe, PipeTransform} from '@angular/core';

import {Participante} from '../../../model/transport-objects';
import {ObjectReference} from '../../model';

@Pipe({
  name: 'usuariosImexiveis',
})
export class UsuariosImexiveisPipe implements PipeTransform {
  transform(values: Participante[]): ObjectReference[] {
    return values ?
               values.filter((u: Participante) => u.isAutor)
                   .map((u: Participante) => u.usuarioRef) :
               [];
  }
}
