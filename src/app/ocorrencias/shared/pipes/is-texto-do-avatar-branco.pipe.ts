import {Pipe, PipeTransform} from '@angular/core';

import memo from 'memo-decorator';

import {CorDoParticipante} from '../../ocorrencia-detalhes/ocorrencia-detalhes-component.service';

@Pipe({
  name: 'isTextoDoAvatarBranco',
})
export class IsTextoDoAvatarBrancoPipe implements PipeTransform {
  @memo()
  transform(email: string, coresDosParticipantes?: CorDoParticipante[]): boolean {
    if (!coresDosParticipantes) {
      return false;
    }

    const corDoPartipante = coresDosParticipantes.find(
      (c: CorDoParticipante) => c.usuarioRef.code === email,
    );
    return corDoPartipante ? corDoPartipante.isTextoDoAvatarBranco : false;
  }
}
