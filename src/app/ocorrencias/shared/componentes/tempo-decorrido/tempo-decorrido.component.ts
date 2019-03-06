import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-tempo-decorrido',
  templateUrl: './tempo-decorrido.component.html',
  styleUrls: ['./tempo-decorrido.component.scss'],
})
export class TempoDecorridoComponent {
  /** mostra o tempo decorrido de maneira adequada */
  @Input() data: Date;
}
