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

import {ObjectReference} from '../../../../model/transport-objects';
import {
  PESSOAS_SERVICE_ADAPTER,
  PessoaServiceAdapter,
} from './pessoa-service-adapter';
import {
  SelecaoDePessoasComponentService,
} from './selecao-de-pessoas-component.service';

@Component({
  selector: 'app-selecao-de-pessoas',
  templateUrl: './selecao-de-pessoas.component.html',
  styleUrls: ['./selecao-de-pessoas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  exportAs: 'selecaoDePessoasComponent',
})
export class SelecaoDePessoasComponent implements OnDestroy,
    AfterViewInit {
  /** usuários escolhidos */
  @Input()
  get usuariosEscolhidos(): ObjectReference[] {
    return this._usuariosEscolhidos;
  }
  set usuariosEscolhidos(value: ObjectReference[]) {
    this._usuariosEscolhidos = value;

    this._usuariosEscolhidos$.next(value);
  }
  private _usuariosEscolhidos: ObjectReference[] = [];
  private _usuariosEscolhidos$: Subject<ObjectReference[]> =
      new Subject<ObjectReference[]>();

  /** usuários escolhidos */
  @Input() usuariosImexiveis: ObjectReference[];

  /** emite quando há alteração dos usuários escolhidos */
  @Output()
  usuariosEscolhidosChange: EventEmitter<ObjectReference[]> =
      new EventEmitter<ObjectReference[]>();

  /** habilita o mat tooltip */
  @Input() matTooltipDisabled = true;

  /**
   * Máximo de usuários que podem ser escolhidos (valores negativos significam
   * que não há limites)
   */
  @Input() maxUsuarios = -1;

  /** lista de escolhas */
  @ViewChild(MatSelectionList) _matSelectionList: MatSelectionList;

  /** controle do componente de filtragem */
  _filtroCtrl: FormControl = new FormControl('');

  /** usuários disponíveis no momento */
  _usuariosDisponiveis: ObjectReference[];

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(@Inject(PESSOAS_SERVICE_ADAPTER)
              private _selecaoDePessoasAdapterService: PessoaServiceAdapter,
              private _selecaoDePessoasComponentService:
                  SelecaoDePessoasComponentService,
              private _snakbar: MatSnackBar, private _cd: ChangeDetectorRef) {}

  ngAfterViewInit() { this._setupFiltroDePessoas(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._usuariosEscolhidos$ && !this._usuariosEscolhidos$.closed) {
      this._usuariosEscolhidos$.complete();
    }
  }

  /**
   * Mantém o estado dos usuários escolhidos
   *
   * @param {MatSelectionListChange} change
   * @memberof SelecaoDePessoasComponent
   */
  _alteracaoNaListaEscolhida(change: MatSelectionListChange) {
    const usuario = change.option.value as ObjectReference;

    if ((this.usuariosImexiveis &&
         this.usuariosImexiveis.some((u: ObjectReference) =>
                                         u.code === usuario.code))) {
      change.option.toggle();
      return;
    }

    if (this._usuariosEscolhidos.length === this.maxUsuarios &&
        change.option.selected) {
      change.option.toggle();

      this._snakbar.open(
          'Máximo de usuários atingido', '',
          {horizontalPosition: 'end', verticalPosition: 'top',  duration: 3000});
      return;
    }

    if (change.option.selected) {
      // Algum U=usuário foi selecionado...
      if (!this._usuariosEscolhidos.some(
              (u: ObjectReference) => u.code === change.option.value.code)) {
        // O usuário selecionado não estava na lista de escolhidos ainda (sei lá
        // por quê)...
        this._usuariosEscolhidos.push(change.option.value);
      }
    } else {
      // Algum usuário teve sua seleção cancelada...
      const index = this._usuariosEscolhidos.findIndex(
          (u: ObjectReference) => u.code === change.option.value.code);

      if (index > -1) {
        // Se o usuário for encontrado na lista dos escolhidos...
        this._usuariosEscolhidos.splice(index, 1);
      }
    }

    this.usuariosEscolhidosChange.emit(this._usuariosEscolhidos);
  }

  /** monitora o que o usuário está digitando */
  private _setupFiltroDePessoas() {
    combineLatest(this._filtroCtrl.valueChanges,
                  this._usuariosEscolhidos$.pipe(startWith([])))
        .pipe(startWith(['', []]), debounceTime(300),
              map(([valor, _]) => valor),
              switchMap((valor: string) =>
                            this._selecaoDePessoasAdapterService.obtemPessoas(
                                0, 20, valor)),
              tap((pessoas: ObjectReference[]) => {
                this._selecaoDePessoasComponentService
                    ._adicionaPessoasSeNaoExistir(pessoas,
                                                  this._usuariosEscolhidos);
                this._usuariosDisponiveis = pessoas;
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
   * @memberof SelecaoDePessoasComponent
   */
  private _selecionaUsuariosJaEscolhidos() {
    if (this._usuariosEscolhidos) {
      this._matSelectionList.options.forEach((item: MatListOption) => {
        if (this._usuariosEscolhidos.some((u: ObjectReference) =>
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
