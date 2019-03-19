import {Pipe, PipeTransform} from '@angular/core';

import {Interacao, TipoInteracao} from '@model-objects';

@Pipe({name: 'somenteComentarios'})
export class SomenteComentariosPipe implements PipeTransform {
  transform(value: Interacao[]): Interacao[] {
    return !value || !value.length ?
               [] :
               value.filter((i: Interacao) =>
                                i.tipoInteracao === TipoInteracao.COMENTARIO);
  }
}
