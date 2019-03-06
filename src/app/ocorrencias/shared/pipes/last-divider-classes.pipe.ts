import {Pipe, PipeTransform} from '@angular/core';

import {Evento} from '../../../model/transport-objects';

@Pipe({name: 'lastDividerClasses'})
export class LastDividerClassesPipe implements PipeTransform {
  transform(evento: Evento): {[key: string]: boolean} {
    return evento ?
               {
                 'app-ocorrencia-last-divider-resolvido': evento.isResolvido,
                 'app-ocorrencia-last-divider-nao-resolvido':
                     !evento.isResolvido,
               } :
               {};
  }
}
