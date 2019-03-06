import {
  AfterViewInit,
  Component,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';

import {combineLatest, Subject} from 'rxjs';
import {filter, map, takeUntil} from 'rxjs/operators';

import {SubTipoEvento, TipoEvento} from '../../../../model/transport-objects/';

import {enterFormAnimation} from '../../../animations';

export interface TipoSubtipoDeEventoComponentData {
  descricaoTipoEvento: string;
  descricaoSubTipoEvento: string;
}

@Component({
  selector: 'app-tipo-subtipo-de-evento',
  templateUrl: './tipo-subtipo-de-evento.component.html',
  styleUrls: ['./tipo-subtipo-de-evento.component.scss'],
  animations: [enterFormAnimation],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TipoSubtipoDeEventoComponent,
      multi: true,
    },
  ],
})
export class TipoSubtipoDeEventoComponent implements ControlValueAccessor,
    OnDestroy, AfterViewInit {
  _form: FormGroup;

  private _disabled = true;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;

    if (disabled) {
      this._form.disable();
    } else {
      this._form.enable();
    }
  }

  /** tipos de eventos disponíveis */
  private _tipoEventosDisponiveis$: Subject<TipoEvento[]> =
      new Subject<TipoEvento[]>();
  private _tipoEventosDisponiveis: TipoEvento[];
  @Input()
  get tipoEventosDisponiveis(): TipoEvento[] {
    return this._tipoEventosDisponiveis;
  }
  set tipoEventosDisponiveis(tiposDisponiveis: TipoEvento[]) {
    this._tipoEventosDisponiveis = tiposDisponiveis;
    this._tipoEventosDisponiveis$.next(tiposDisponiveis);
  }

  /** implementação do ControlValueAccessor */
  _onChange: (_: TipoSubtipoDeEventoComponentData) => void;

  /** implementação do ControlValueAccessor */
  @HostListener('blur') _onTouch: () => void;

  private _tipoSubtipoDeEventoComponentData$:
      Subject<TipoSubtipoDeEventoComponentData> =
          new Subject<TipoSubtipoDeEventoComponentData>();

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(private _fb: FormBuilder) {
    this._form = this._fb.group({
      tipoEvento: [null, Validators.required],
      subTipoEvento: [null, Validators.required],
    });

    this._setupFormData();
  }

  ngAfterViewInit() { this._setupFormSubscribers(); }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  /** implementação do ControlValueAccessor */
  writeValue(obj: TipoSubtipoDeEventoComponentData): void {
    this._tipoSubtipoDeEventoComponentData$.next(obj);
  }

  /** implementação do ControlValueAccessor */
  registerOnChange(fn: (_: TipoSubtipoDeEventoComponentData) => void): void {
    this._onChange = fn;
  }

  /** implementação do ControlValueAccessor */
  registerOnTouched(fn: () => void): void { this._onTouch = fn; }

  /** implementação do ControlValueAccessor */
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }

  /** configura dados do formulário */
  private _setupFormData() {
    combineLatest(this._tipoSubtipoDeEventoComponentData$,
                  this._tipoEventosDisponiveis$.pipe(filter(Boolean)))
        .pipe(map(([tipoSubtipoDeEventoComponentData, _]) =>
                      tipoSubtipoDeEventoComponentData),
              takeUntil(this._destroy$))
        .subscribe((data: TipoSubtipoDeEventoComponentData) => {
          const tipoEvento: TipoEvento =
              data && data.descricaoTipoEvento ?
                  this.tipoEventosDisponiveis.find(
                      (t: TipoEvento) =>
                          t.descricao.toUpperCase() ===
                          data.descricaoTipoEvento.toUpperCase()) :
                  null;
          const subTipoEvento: SubTipoEvento =
              tipoEvento ?
                  tipoEvento.listaSubTipoEvento.find(
                      (s: SubTipoEvento) =>
                          s.descricao.toUpperCase() ===
                          data.descricaoSubTipoEvento.toUpperCase()) :
                  null;

          this._form.setValue({
              tipoEvento, subTipoEvento,
          });
        });
  }

  /** configura assinaturas do formulário */
  private _setupFormSubscribers() {
    this._form.valueChanges.pipe(takeUntil(this._destroy$))
        .subscribe((value) => {
          this._onChange({
            descricaoSubTipoEvento:
                value && value.subTipoEvento ?
                    (value.subTipoEvento as SubTipoEvento).descricao :
                    null,
            descricaoTipoEvento:
                value && value.tipoEvento ?
                    (value.tipoEvento as TipoEvento).descricao :
                    null,
          });

          this._onTouch();
        });
  }
}
