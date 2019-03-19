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

import {
  SelecaoDeCursosComponent,
} from '../../shared/componentes/selecao-de-cursos/selecao-de-cursos.component';

import {
  ArrayUtils,
  DifferenceArrays,
} from '../../shared';

// tslint:disable-next-line: no-implicit-dependencies
import {ObjectReference} from '@model-objects';

export interface SearchBarFiltroCursoComponentChange {
  /**
   * code: id do centro de curso
   * description: nome do curso
   * extra: unidade
   */
  cursosRef: ObjectReference[];
}

@Component({
  selector: 'app-search-bar-filtro-curso',
  templateUrl: './search-bar-filtro-curso.component.html',
  styleUrls: ['./search-bar-filtro-curso.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchBarFiltroCursoComponent implements OnDestroy,
    AfterViewInit {
  /** Histórico da última seleção feita */
  @Input() cursosDaUltimaSelecao: ObjectReference[] = [];

  /** Emite quando há alterações na curso */
  @Output()
  cursosSelecionadosChange: EventEmitter<SearchBarFiltroCursoComponentChange> =
      new EventEmitter<SearchBarFiltroCursoComponentChange>();

  /**
   * Instância do componente de seleção de cursos (para obter a quantidade de
   * cursos selecionados)
   */
  @ViewChild(SelecaoDeCursosComponent)
  _selecaoDeCursosComponent: SelecaoDeCursosComponent;

  /** Instância do popover */
  @ViewChild(SatPopover) _popover: SatPopover;

  /** indica que os tooltips de usuários estarão habilitados no popover */
  _matUsusarioTooltipDisabled = true;

  /** emite quando há alteração de participantes para ser gravado no banco */
  private _cursosSelecionados$: ReplaySubject<ObjectReference[]> =
      new ReplaySubject<ObjectReference[]>(1);

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _arrayUtils: ArrayUtils) {}

  ngAfterViewInit() { this._setupMonitoramentoSelecaoDeCursos(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._cursosSelecionados$ && !this._cursosSelecionados$.closed) {
      this._cursosSelecionados$.complete();
    }
  }

  /**
   * Paraliza a atualização de tela enquanto o popover estiver aberto (caso
   * contrário perde-se as opcões escolhidas)
   */
  _monitoraAberturaFechamentoDoPopover(popoverFoiAberto: boolean) {
    this._matUsusarioTooltipDisabled = !popoverFoiAberto;

    if (!popoverFoiAberto) {
      this._cursosSelecionados$.pipe(first())
          .subscribe((cursos: ObjectReference[]) => {
            const ad: DifferenceArrays<ObjectReference> =
                this._arrayUtils.obtemDiferencaEntreArrays<ObjectReference>(
                    this.cursosDaUltimaSelecao, cursos,
                    (a: ObjectReference, b: ObjectReference) =>
                        a && b && a.code && b.code ? a.code === b.code : false);

            if (!(ad &&
                  ((ad.addedElements && !!ad.addedElements.length) ||
                   (ad.removedElements && !!ad.removedElements.length)))) {
              // não há alterações
              return;
            }

            this.cursosDaUltimaSelecao = [...cursos];

            this.cursosSelecionadosChange.emit({
              cursosRef: cursos,
            });

            this._cursosSelecionados$.next(cursos);
          });
    }
  }

  /** Limpa o filtro de cursos */
  _limpaFiltro() {
    this.cursosDaUltimaSelecao = [];
    this.cursosSelecionadosChange.emit({cursosRef: []});

    this._cursosSelecionados$.next([]);
  }

  /**
   * Monitora a alteração de participantes
   *
   * @private
   * @memberof OcorrenciaDetalhesConfiguracoesParticipantesComponent
   */
  private _setupMonitoramentoSelecaoDeCursos() {
    this._selecaoDeCursosComponent.cursosEscolhidosChange
        .pipe(takeUntil(this._destroy$))
        .subscribe(this._cursosSelecionados$);
  }
}
