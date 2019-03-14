import {Pipe, PipeTransform} from '@angular/core';

import {
  Evento,
  Participante,
  TipoVisibilidade,
} from '../../../model/transport-objects';
import {ObjectReference} from '../../model';

@Pipe({name: 'extraiVisibilidadeEvento'})
export class ExtraiVisibilidadeEventoPipe implements PipeTransform {
  transform(evento: Evento, usuarioLogado: {
    usuarioRef: ObjectReference;
    isAdministrador?: boolean;
  }): boolean {
    if (usuarioLogado.isAdministrador) {
      return true;
    }

    if (evento.visibilidade.tipo === TipoVisibilidade.TODOS) {
      return true;
    }

    if (evento.visibilidade.tipo === TipoVisibilidade.SOMENTE_PARTICIPANTES) {
      if (evento.participantes.some((p: Participante) =>
                                        p.usuarioRef.code ===
                                        usuarioLogado.usuarioRef.code)) {
        return true;
      }
    }

    return false;
  }
}
