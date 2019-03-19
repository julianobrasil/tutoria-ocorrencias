import {Component, Input} from '@angular/core';

import {Interacao} from '@model-objects';

@Component({
  selector: 'app-ocorrencia-bagde',
  templateUrl: './ocorrencia-bagde.component.html',
  styleUrls: ['./ocorrencia-bagde.component.scss'],
})
export class OcorrenciaBagdeComponent {
  /** comentário em questão */
  @Input() comentario: Interacao;
}
