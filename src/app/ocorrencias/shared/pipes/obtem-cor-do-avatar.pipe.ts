import {Pipe, PipeTransform} from '@angular/core';

import memo from 'memo-decorator';

import {CorDoParticipante} from '../../ocorrencia-detalhes/ocorrencia-detalhes-component.service';

@Pipe({
  name: 'obtemCorDoAvatar',
})
export class ObtemCorDoAvatarPipe implements PipeTransform {
  @memo()
  transform(email: string, coresDosParticipantes?: CorDoParticipante[]): string {
    if (!coresDosParticipantes) {
      return '';
    }

    const corDoParticpante = coresDosParticipantes.find(
      (c: CorDoParticipante) => c.usuarioRef.code === email,
    );
    return corDoParticpante ? corDoParticpante.codigoCorHexadecimal : '';
  }
}
