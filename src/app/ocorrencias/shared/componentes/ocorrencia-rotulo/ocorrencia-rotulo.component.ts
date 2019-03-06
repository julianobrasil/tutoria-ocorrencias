import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ocorrencia-rotulo',
  templateUrl: './ocorrencia-rotulo.component.html',
  styleUrls: ['./ocorrencia-rotulo.component.scss'],
})
export class OcorrenciaRotuloComponent {
  /** texto do rótulo */
  @Input() rotulo: string;

  /** cor a ser aplicado ao componente */
  @Input() corDeFundo: string;
}
