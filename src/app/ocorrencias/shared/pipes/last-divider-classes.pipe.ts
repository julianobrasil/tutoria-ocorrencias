import {Pipe, PipeTransform} from '@angular/core';

import {Evento} from '@model-objects';

@Pipe({name: 'lastDividerClasses'})
export class LastDividerClassesPipe implements PipeTransform {
  transform(evento: Evento): {[key: string]: boolean} {
    return evento ?
               {
                 'app-ocorrencia-last-divider-resolvido': evento.isEncerrado,
                 'app-ocorrencia-last-divider-nao-resolvido':
                     !evento.isEncerrado,
               } :
               {};
  }
}
