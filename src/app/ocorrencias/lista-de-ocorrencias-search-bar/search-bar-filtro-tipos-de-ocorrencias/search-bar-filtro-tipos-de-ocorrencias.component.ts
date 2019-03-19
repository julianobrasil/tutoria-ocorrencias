// tslint:disable: max-line-length
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

import {ReplaySubject, Subject} from 'rxjs';
import {first, takeUntil, tap} from 'rxjs/operators';

import {SatPopover} from '@ncstate/sat-popover';

import {ArrayUtils, DifferenceArrays} from '../../shared';

import {
  SelecaoDeTiposDeOcorrenciasComponent,
} from '../../shared/componentes/selecao-de-tipos-de-ocorrencias/selecao-de-tipos-de-ocorrencias.component';
import {
  TipoSubtipoInfo,
} from '../../shared/componentes/selecao-de-tipos-de-ocorrencias/tipos-de-ocorrencia-service-adapter';
// tslint:enable: max-line-length

export interface SearchBarFiltroTipoDeOcorrenciaComponentChange {
  /**
   * code: id do centro de curso
   * description: nome do curso
   * extra: unidade
   */
  tiposDeOcorrenciasInfo: TipoSubtipoInfo[];
}

@Component({
  selector: 'app-search-bar-filtro-tipos-de-ocorrencias',
  templateUrl: './search-bar-filtro-tipos-de-ocorrencias.component.html',
  styleUrls: ['./search-bar-filtro-tipos-de-ocorrencias.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarFiltroTiposDeOcorrenciasComponent implements OnDestroy,
    AfterViewInit {
  /** Histórico da última seleção feita */
  @Input() tiposDeOcorrenciasDaUltimaSelecao: TipoSubtipoInfo[] = [];

  /** Emite quando há alterações na curso */
  @Output()
  tiposDeOcorrenciasSelecionadosChange:
      EventEmitter<SearchBarFiltroTipoDeOcorrenciaComponentChange> =
          new EventEmitter<SearchBarFiltroTipoDeOcorrenciaComponentChange>();

  /**
   * Instância do componente de seleção de tiposDeOcorrencias (para obter a
   * quantidade de
   * tiposDeOcorrencias selecionados)
   */
  @ViewChild(SelecaoDeTiposDeOcorrenciasComponent)
  _selecaoDeTipoDeOcorrenciasComponent: SelecaoDeTiposDeOcorrenciasComponent;

  /** Instância do popover */
  @ViewChild(SatPopover) _popover: SatPopover;

  /** emite quando há alteração de participantes para ser gravado no banco */
  private _tiposDeOcorrenciasSelecionados$: ReplaySubject<TipoSubtipoInfo[]> =
      new ReplaySubject<TipoSubtipoInfo[]>(1);

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _arrayUtils: ArrayUtils) {}

  ngAfterViewInit() { this._setupMonitoramentoSelecaoDeTipoDeOcorrencias(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._tiposDeOcorrenciasSelecionados$ &&
        !this._tiposDeOcorrenciasSelecionados$.closed) {
      this._tiposDeOcorrenciasSelecionados$.complete();
    }
  }

  /**
   * Paraliza a atualização de tela enquanto o popover estiver aberto (caso
   * contrário perde-se as opcões escolhidas)
   */
  _monitoraAberturaFechamentoDoPopover(popoverFoiAberto: boolean) {
    if (!popoverFoiAberto) {
      this._tiposDeOcorrenciasSelecionados$.pipe(first())
          .subscribe((tiposDeOcorrencias: TipoSubtipoInfo[]) => {
            const ad: DifferenceArrays<TipoSubtipoInfo> =
                this._arrayUtils.obtemDiferencaEntreArrays<TipoSubtipoInfo>(
                    this.tiposDeOcorrenciasDaUltimaSelecao, tiposDeOcorrencias,
                    (a: TipoSubtipoInfo, b: TipoSubtipoInfo) =>
                        a && b && a.nomeTipo && b.nomeTipo ?
                            a.nomeTipo === b.nomeTipo &&
                                a.nomeSubtipo === b.nomeSubtipo :
                            false);

            if (!(ad &&
                  ((ad.addedElements && !!ad.addedElements.length) ||
                   (ad.removedElements && !!ad.removedElements.length)))) {
              // não há alterações
              return;
            }

            this.tiposDeOcorrenciasDaUltimaSelecao = [...tiposDeOcorrencias];

            this.tiposDeOcorrenciasSelecionadosChange.emit({
              tiposDeOcorrenciasInfo: tiposDeOcorrencias,
            });

            this._tiposDeOcorrenciasSelecionados$.next(tiposDeOcorrencias);
          });
    }
  }

  /** Limpa o filtro de tiposDeOcorrencias */
  _limpaFiltro() {
    this.tiposDeOcorrenciasDaUltimaSelecao = [];
    this.tiposDeOcorrenciasSelecionadosChange.emit(
        {tiposDeOcorrenciasInfo: []});

    this._tiposDeOcorrenciasSelecionados$.next([]);
  }

  /**
   * Monitora a alteração de participantes
   *
   * @private
   * @memberof OcorrenciaDetalhesConfiguracoesParticipantesComponent
   */
  private _setupMonitoramentoSelecaoDeTipoDeOcorrencias() {
    this._selecaoDeTipoDeOcorrenciasComponent.tiposEscolhidosChange
        .pipe(takeUntil(this._destroy$))
        .subscribe(this._tiposDeOcorrenciasSelecionados$);
  }
}
