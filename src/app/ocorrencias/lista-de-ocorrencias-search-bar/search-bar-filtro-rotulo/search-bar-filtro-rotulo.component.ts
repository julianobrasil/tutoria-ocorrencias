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
import {first, takeUntil} from 'rxjs/operators';

// tslint:disable-next-line: no-implicit-dependencies
import {RotuloDoEvento} from '@model-objects';
import {ArrayUtils, DifferenceArrays} from '../../shared';
import {
  SelecaoDeRotulosComponent,
} from '../../shared/componentes/selecao-de-rotulos/selecao-de-rotulos.component';

// tslint:enable: max-line-length

export interface SearchBarFiltroRotuloComponentChange {
  rotulos: RotuloDoEvento[];
}

@Component({
  selector: 'app-search-bar-filtro-rotulo',
  templateUrl: './search-bar-filtro-rotulo.component.html',
  styleUrls: ['./search-bar-filtro-rotulo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarFiltroRotuloComponent implements OnDestroy,
    AfterViewInit {
  /**
   * Quando false, mostra somente os não reservados. Quando True, mostra
   * somente os reservados
   */
  @Input() reservados = false;

  @Input()
  get rotulosDaUltimaSelecao(): RotuloDoEvento[] {
    return this._rotulosDaUltimaSelecao;
  }
  set rotulosDaUltimaSelecao(value: RotuloDoEvento[]) {
    this._rotulosDaUltimaSelecao = value;
  }
  private _rotulosDaUltimaSelecao: RotuloDoEvento[] = [];

  /** Emite quando há alterações nos rótulos */
  @Output()
  rotulosSelecionadosChange:
      EventEmitter<SearchBarFiltroRotuloComponentChange> =
          new EventEmitter<SearchBarFiltroRotuloComponentChange>();

  /**
   * Instância do componente de seleção de rótulos (para obter a quantidade de
   * rótulos selecionadas)
   */
  @ViewChild(SelecaoDeRotulosComponent)
  _selecaoDeRotulosComponent: SelecaoDeRotulosComponent;

  /** emite quando há alteração de rótulos para ser gravado no banco */
  _rotulosAlterados$: ReplaySubject<RotuloDoEvento[]> =
      new ReplaySubject<RotuloDoEvento[]>(1);

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _arrayUtils: ArrayUtils) {}

  ngAfterViewInit() { this._setupMonitoramentoAlteracaoDeRotulos(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._rotulosAlterados$ && !this._rotulosAlterados$.closed) {
      this._rotulosAlterados$.complete();
    }
  }

  /**
   * Paraliza a atualização de tela enquanto o popover estiver aberto (caso
   * contrário perde-se as opcões escolhidas)
   */
  _monitoraAberturaFechamentoDoPopover(popoverFoiAberto: boolean) {
    if (!popoverFoiAberto) {
      this._rotulosAlterados$.pipe(first())
          .subscribe((rotulos: RotuloDoEvento[]) => {
            const ad: DifferenceArrays<RotuloDoEvento> =
                this._arrayUtils.obtemDiferencaEntreArrays<RotuloDoEvento>(
                    this.rotulosDaUltimaSelecao, rotulos,
                    (a: RotuloDoEvento, b: RotuloDoEvento) =>
                        a && b && a.id && b.id ? a.id === b.id : false);
            if (!(ad &&
                  ((ad.addedElements && !!ad.addedElements.length) ||
                   (ad.removedElements && !!ad.removedElements.length)))) {
              // não há alterações
              return;
            }

            this.rotulosDaUltimaSelecao = [...rotulos];

            this.rotulosSelecionadosChange.emit({rotulos});

            this._rotulosAlterados$.next(rotulos);
          });
    }
  }

  /** Limpa o filtro de rótulos */
  _limpaFiltro() {
    this.rotulosDaUltimaSelecao = [];
    this.rotulosSelecionadosChange.emit({rotulos: []});

    this._rotulosAlterados$.next([]);
  }

  /**
   * Monitora a alteração de participantes
   *
   * @private
   * @memberof OcorrenciaDetalhesConfiguracoesParticipantesComponent
   */
  private _setupMonitoramentoAlteracaoDeRotulos() {
    this._selecaoDeRotulosComponent.rotulosEscolhidosChange
        .pipe(takeUntil(this._destroy$))
        .subscribe(this._rotulosAlterados$);
  }
}
