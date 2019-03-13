// tslint:disable:max-line-length
import {
  AfterViewInit,
  Component,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';

import {Observable, of as observableOf} from 'rxjs';
import {debounceTime, map, startWith, switchMap} from 'rxjs/operators';

import {
  ForceSelectionDirective,
} from '../../../../shared/directives/force-selection/force-selection.directive';

import {ObjectReference} from '../../../../model/transport-objects';

import {
  PaginaDeResposta,
} from '../../../../model/servicos/classes/respostas-do-servidor/pagina-de-resposta';
import {UsuarioService} from '../../../../model/servicos/dao/usuario.service';

// tslint:enable:max-line-length

@Component({
  selector: 'app-autocomplete-usuarios',
  templateUrl: './autocomplete-usuarios.component.html',
  styleUrls: ['./autocomplete-usuarios.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AutocompleteUsuariosComponent),
      multi: true,
    },
  ],
})
export class AutocompleteUsuariosComponent implements OnInit,
    AfterViewInit, ControlValueAccessor {
  _formControl: FormControl = new FormControl();

  @ViewChild('forceSelection') _forceSelection: ForceSelectionDirective;

  /** Emite a disciplina selecionada no autocomplete de disciplina */
  @Output()
  optionSelected: EventEmitter<ObjectReference> =
      new EventEmitter<ObjectReference>();

  /** Emite a disciplina selecionada no autocomplete de disciplina */
  @Output() inputCleared: EventEmitter<any> = new EventEmitter<any>();

  /** label do input do autocomplete */
  @Input() label = 'Usuário';

  /** placeholder do input do autocomplete */
  @Input() placeholder = '';

  /** appearance do input do autocomplete */
  @Input() appearance = 'fill';

  @Input() cssPanelClass = '';

  /** habilita desabilita via propriedade */
  _disabled = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;
    if (disabled) {
      this._formControl.disable({emitEvent: false});
    } else {
      this._formControl.enable({emitEvent: false});
    }
  }

  /** Lista de opções do autocomplete de espaços */
  _usuariosPossiveis$: Observable<ObjectReference[]>;

  /** search spinners dos autocompletes */
  _showUsuariosSearchSpinner = false;

  /** exigido pela interface do ControlValueAccessor */
  _onChange: (_: ObjectReference) => void;

  /** exigido pela interface do ControlValueAccessor */
  @HostListener('blur') _onTouched: () => void;

  constructor(private _usuarioService: UsuarioService) {}

  ngOnInit() { this._inicializaAutocompleteUsuario(); }

  ngAfterViewInit() {
    this._forceSelection.inputCleared.subscribe(() => this.inputCleared.emit());
  }

  /** Exigido pela interface ControlValueAcessor */
  writeValue(obj: ObjectReference): void {
    this._formControl.setValue(obj, {emitEvent: false});
  }

  /** Exigido pela interface ControlValueAcessor */
  registerOnChange(fn: (_: ObjectReference) => void): void {
    this._onChange = fn;
  }

  /** Exigido pela interface ControlValueAcessor */
  registerOnTouched(fn: any): void { this._onTouched = fn; }

  /** Exigido pela interface ControlValueAcessor */
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this._formControl.disable();
    } else {
      this._formControl.enable();
    }
  }

  /** Emite professor escolhido */
  _emiteUsuarioEscolhido(professor: ObjectReference) {
    this._onChange(this._formControl.value);
    this.optionSelected.emit(professor);
  }

  /** informação a ser mostrada no input do autcomplete de Professores */
  _displayWithUsuario(value: ObjectReference | string): string | null {
    if (!value || typeof value === 'string') {
      return '';
    }

    return value.description;
  }

  /** Inicializa o observable de professores */
  private _inicializaAutocompleteUsuario() {
    this._usuariosPossiveis$ = this._formControl.valueChanges.pipe(
        startWith(null), debounceTime(500),
        switchMap((valor: ObjectReference | string |
                   null): Observable<ObjectReference[] | null> => {
          if (!valor) {
            return observableOf(null);
          }

          this._showUsuariosSearchSpinner = true;
          if (typeof valor === 'string') {
            return this._usuarioService.obtemUsuariosPaginadosPorParteDoNome(
                                           20, 0, valor)
                .pipe(map((pagina: PaginaDeResposta<ObjectReference>) => {
                  this._showUsuariosSearchSpinner = false;
                  return pagina.content.sort(
                      (a: ObjectReference, b: ObjectReference) =>
                          a.description.localeCompare(b.description, 'pt-br',
                                                      {sensitivity: 'base'}));
                }));
          } else {
            this._showUsuariosSearchSpinner = false;
            return observableOf<ObjectReference[]>([valor]);
          }
        }));
  }
}
