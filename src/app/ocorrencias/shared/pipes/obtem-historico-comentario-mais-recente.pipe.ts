import {Pipe, PipeTransform} from '@angular/core';

import {HistoricoInteracao, Interacao} from '@model-objects';

@Pipe({name: 'obtemHistoricoComentarioMaisRecente'})
export class ObtemHistoricoComentarioMaisRecentePipe implements PipeTransform {
  transform(comentario: Interacao): HistoricoInteracao {
    comentario.historicoInteracoes.sort((a, b) => new Date(b.data).getTime() -
                                                  new Date(a.data).getTime());
    return comentario.historicoInteracoes[0];
  }
}
