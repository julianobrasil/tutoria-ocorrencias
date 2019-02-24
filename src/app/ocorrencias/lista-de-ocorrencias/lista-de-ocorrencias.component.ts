// tslint:disable:max-line-length
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';

import {MatPaginatorIntl, PageEvent} from '@angular/material';

import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {Evento} from '../../model/transport-objects';
import {MatPaginatorIntlListaDeOcorrenciasPtBr} from '../i18n/mat-paginator-intl-lista-de-ocorrencias-pt-br';
import {Paginacao} from '../ocorrencia-facade.service';
// tslint:enable:max-line-length

@Component({
  selector: 'app-lista-de-ocorrencias',
  templateUrl: './lista-de-ocorrencias.component.html',
  styleUrls: ['./lista-de-ocorrencias.component.scss'],
  providers: [{provide: MatPaginatorIntl, useClass: MatPaginatorIntlListaDeOcorrenciasPtBr}],
})
export class ListaDeOcorrenciasComponent {
  /** eventos para serem listados */
  @Input()
  eventos: Evento[];

  /** dados de paginação */
  @Input()
  paginacao: Paginacao = {
    page: 0,
    pageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  };

  /** termo de busca configurado */
  @Input()
  termoDeBusca = '';

  /** emite quando algum parâmetro da paginação é trocado */
  @Output()
  paginacaoChange: EventEmitter<Paginacao> = new EventEmitter<Paginacao>();

  /** emite o termo digitado */
  @Output()
  termoDeBuscaChange: EventEmitter<string | null | undefined> = new EventEmitter<
    string | null | undefined
  >();

  /** tela de tablets e celulares */
  _isVerySmallScreen = false;

  /** tela de monitores pequenos */
  _isSmallScreen = false;

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(_breakpointObserver: BreakpointObserver, private _cd: ChangeDetectorRef) {
    const smallScreen = '(max-width: 900px)';
    const verySmallScreen = '(max-width: 780px)';
    _breakpointObserver
      .observe([smallScreen, verySmallScreen])
      .pipe(takeUntil(this._destroy$))
      .subscribe((bpState: BreakpointState) => {
        this._isSmallScreen = bpState.breakpoints[smallScreen];
        this._isVerySmallScreen = bpState.breakpoints[verySmallScreen];
        this._cd.markForCheck();
      });
  }

  /** dispara sinal de que o termo de busca foi alterado */
  _termoDeBuscaAlterado(termo: string) {
    this.termoDeBuscaChange.emit(termo);
  }

  /** configura página */
  _paginaTrocada(evt: PageEvent) {
    this.paginacaoChange.emit({
      page: evt.pageIndex,
      pageSize: evt.pageSize,
    });
  }

  get _showPaginator(): boolean {
    return !(!this.paginacao.page && this.paginacao.totalElements < this.paginacao.pageSize);
  }
}
