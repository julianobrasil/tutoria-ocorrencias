import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-ocorrencia-rotulo',
  templateUrl: './ocorrencia-rotulo.component.html',
  styleUrls: ['./ocorrencia-rotulo.component.scss'],
})
export class OcorrenciaRotuloComponent {
  /** Texto do rótulo */
  @Input() rotulo: string;

  /** Cor a ser aplicado ao componente */
  @Input() corDeFundo: string;

  /** Ícone a ser mostrado no rótulo */
  @Input() icone: string;

  /** Dica para ser mostrada no rótulo */
  @Input() tooltip: string;
}
