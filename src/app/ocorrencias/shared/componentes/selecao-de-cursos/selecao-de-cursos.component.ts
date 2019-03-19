import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';

import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
  MatSnackBar,
} from '@angular/material';

import {combineLatest, Subject} from 'rxjs';
import {
  concatMapTo,
  debounceTime,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

// tslint:disable-next-line: no-implicit-dependencies
import {CentroDeCusto, ObjectReference} from '@model-objects';

import {
  CURSO_SERVICE_ADAPTER as CURSOS_SERVICE_ADAPTER,
  CursoServiceAdapter,
} from './curso-service-adapter';
import {
  SelecaoDeCursosComponentService,
} from './selecao-de-cursos-component.service';

@Component({
  selector: 'app-selecao-de-cursos',
  templateUrl: './selecao-de-cursos.component.html',
  styleUrls: ['./selecao-de-cursos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'selecaoDeCursosComponent',
})
export class SelecaoDeCursosComponent implements AfterViewInit,
    OnDestroy {
  /** usuários escolhidos */
  @Input()
  get cursosEscolhidos(): ObjectReference[] {
    return this._cursosEscolhidos;
  }
  set cursosEscolhidos(value: ObjectReference[]) {
    this._cursosEscolhidos =
        value && value.length !== undefined && value !== null ? [...value] :
                                                                value;

    this._cursosEscolhidos$.next(this._cursosEscolhidos);
  }
  private _cursosEscolhidos: ObjectReference[] = [];
  private _cursosEscolhidos$: Subject<ObjectReference[]> =
      new Subject<ObjectReference[]>();

  /** emite quando há alteração dos usuários escolhidos */
  @Output()
  cursosEscolhidosChange: EventEmitter<ObjectReference[]> =
      new EventEmitter<ObjectReference[]>();

  /** lista de escolhas */
  @ViewChild(MatSelectionList) _matSelectionList: MatSelectionList;

  /** controle do componente de filtragem */
  _filtroCtrl: FormControl = new FormControl('');

  /** usuários disponíveis no momento */
  _cursosDisponiveis: ObjectReference[];

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(CURSOS_SERVICE_ADAPTER)
              private _selecaoDeCursosAdapterService: CursoServiceAdapter,
              private _selecaoDeCursosComponentService:
                  SelecaoDeCursosComponentService,
              private _snakbar: MatSnackBar, private _cd: ChangeDetectorRef) {}

  ngAfterViewInit() { this._setupFiltroDeCursos(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._cursosEscolhidos$ && !this._cursosEscolhidos$.closed) {
      this._cursosEscolhidos$.complete();
    }
  }

  /**
   * Mantém o estado dos cursos escolhidos
   *
   * @param {MatSelectionListChange} change
   * @memberof SelecaoDeCursosComponent
   */
  _alteracaoNaListaEscolhida(change: MatSelectionListChange) {
    if (change.option.selected) {
      // Algum U=usuário foi selecionado...
      if (!this._cursosEscolhidos.some(
              (u: ObjectReference) => u.code === change.option.value.code)) {
        // O usuário selecionado não estava na lista de escolhidos ainda (sei lá
        // por quê)...
        this._cursosEscolhidos.push(change.option.value);
      }
    } else {
      // Algum usuário teve sua seleção cancelada...
      const index = this._cursosEscolhidos.findIndex(
          (u: ObjectReference) => u.code === change.option.value.code);

      if (index > -1) {
        // Se o usuário for encontrado na lista dos escolhidos...
        this._cursosEscolhidos.splice(index, 1);
      }
    }

    this.cursosEscolhidosChange.emit(this._cursosEscolhidos);
  }

  /** monitora o que o usuário está digitando */
  private _setupFiltroDeCursos() {
    combineLatest(this._filtroCtrl.valueChanges.pipe(startWith('')),
                  this._cursosEscolhidos$.pipe(startWith([])))
        .pipe(
            startWith(['', []]), debounceTime(300), map(([valor, _]) => valor),
            switchMap((valor: string) =>
                          this._selecaoDeCursosAdapterService
                              .obtemCentroDeCustosPorNomeDeCurso(20, 0, valor)),
            map((ccs: CentroDeCusto[]): ObjectReference[] =>
                    ccs.map((cc: CentroDeCusto) => ({
                              code: cc.id,
                              description: cc.nomeCurso,
                              extra: `${cc.unidade}::${cc.turno}`,
                            }))),
            tap((cursos: ObjectReference[]) => {
              this._selecaoDeCursosComponentService._adicionaCursosSeNaoExistir(
                  cursos, this._cursosEscolhidos);
              this._cursosDisponiveis = cursos;
              this._cd.markForCheck();
            }),
            concatMapTo(this._matSelectionList.options.changes),
            takeUntil(this._destroy$))
        .subscribe((_) => this._selecionaUsuariosJaEscolhidos());
  }

  /**
   * Quando chegam usuários do banco, pode ser que alguns deles já estejam
   * escolhidos. Eles devem ser marcados na lista.
   *
   * @private
   * @memberof SelecaoDeCursosComponent
   */
  private _selecionaUsuariosJaEscolhidos() {
    if (this._cursosEscolhidos) {
      this._matSelectionList.options.forEach((item: MatListOption) => {
        if (this._cursosEscolhidos.some((u: ObjectReference) =>
                                            u.code === item.value.code)) {
          // Usuário deveria estar selecionado...
          if (!item.selected) {
            // Seleciona se não estiver...
            item.toggle();
          }
        }
      });
    }

    this._cd.markForCheck();
  }
}
