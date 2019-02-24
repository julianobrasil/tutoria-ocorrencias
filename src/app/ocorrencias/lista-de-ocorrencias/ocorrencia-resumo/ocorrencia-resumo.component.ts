import {AfterViewInit, ChangeDetectorRef, Component, Input} from '@angular/core';

import {Evento} from '../../../model/transport-objects';

@Component({
  selector: 'app-ocorrencia-resumo',
  templateUrl: './ocorrencia-resumo.component.html',
  styleUrls: ['./ocorrencia-resumo.component.scss'],
})
export class OcorrenciaResumoComponent implements AfterViewInit {
  /** ocorrência a ser mostrada */
  @Input()
  evento: Evento;

  /** mostra a borda superior */
  @Input()
  showBorderTop: false;

  constructor(private _cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => this._cd.markForCheck(), 500);
  }

  get _containerClasses(): {[key: string]: boolean} {
    return {
      'ocorrencia-container': true,
      'ocorrencia-container-border-top': this.showBorderTop,
    };
  }
}
