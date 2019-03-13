import {Pipe, PipeTransform} from '@angular/core';

import {ObjectReference} from '../../../model/transport-objects';

@Pipe({name: 'isUsuarioImexivel'})
export class IsUsuarioImexivelPipe implements PipeTransform {
  transform(usuario: ObjectReference, usuariosImexiveis: ObjectReference[]): boolean {
    return usuariosImexiveis
      ? usuariosImexiveis.some((u: ObjectReference) => u.code === usuario.code)
      : false;
  }
}
