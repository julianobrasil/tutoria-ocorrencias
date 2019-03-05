import {Pipe, PipeTransform} from '@angular/core';
import {TipoInteracao} from 'src/app/model/transport-objects';

import {Interacao} from '../../../model/transport-objects/interacao';

@Pipe({name: 'somenteComentarios'})
export class SomenteComentariosPipe implements PipeTransform {
  transform(value: Interacao[]): Interacao[] {
    return !value || !value.length ?
        [] :
        value.filter(
            (i: Interacao) => i.tipoInteracao === TipoInteracao.COMENTARIO);
  }
}
