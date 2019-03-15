import {FormControl, FormGroup} from '@angular/forms';

import {Input, Output, EventEmitter} from '@angular/core';

import {BehaviorSubject, Subject} from 'rxjs';

import {
  OcorrenciaFormularioComponentData,
  OcorrenciaFormularioComponentTipo,
} from '../../ocorrencia-formulario/ocorrencia-formulario-component.service';

import {Unidade} from "src/app/model/transport-objects";
import {Issue} from '../../model';

export abstract class AbstractIssueForm<T> {
  _form: FormGroup = new FormGroup({title: new FormControl()});

  private _disabled = false;
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

  /** _entity to be edited */
  private _entity$: BehaviorSubject<T> = new BehaviorSubject<T>(null);
  private _entity: T = null;
  @Input()
  get entity(): T {
    return this._entity;
  }
  set entity(entity: T) {
    this._entity = entity ? JSON.parse(JSON.stringify(entity)) : entity;

    if (!entity) {
      this._form.reset();
      return;
    }

    this._entity$.next(entity);
  }

  /** emite quando a ocorrência precisa ser gravada */
  @Output()
  dadosDoFormularioParaGravar: EventEmitter<OcorrenciaFormularioComponentData> =
      new EventEmitter<OcorrenciaFormularioComponentData>();

  /** emite quando o botão de cancelar é clicado */
  @Output()
  cancelamentoSolicitado: EventEmitter<void> = new EventEmitter<void>();
}
