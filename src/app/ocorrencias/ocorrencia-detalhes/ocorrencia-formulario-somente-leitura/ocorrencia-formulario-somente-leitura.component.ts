import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

import {Evento} from '../../../model/transport-objects';

@Component({
  selector: 'app-ocorrencia-formulario-somente-leitura',
  templateUrl: './ocorrencia-formulario-somente-leitura.component.html',
  styleUrls: ['./ocorrencia-formulario-somente-leitura.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciaFormularioSomenteLeituraComponent {
  /** evento cujos detalhes deve ser mostrado */
  @Input()
  ocorrencia: Evento;

  /** cor do avatar do participante */
  @Input()
  corDoAvatar: string;

  /** true se a fonte do avatar for branca */
  @Input()
  isTextoDoAvatarBranco = false;

  constructor() {}
}
