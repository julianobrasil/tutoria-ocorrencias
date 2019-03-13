import {Directive, Host, HostListener, Input, OnDestroy, OnInit, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material';

import {Subject, Subscription} from 'rxjs';
import {withLatestFrom} from 'rxjs/operators';

@Directive({
  selector: '[appForceSelection]',
  exportAs: 'appForceSelection',
})
export class ForceSelectionDirective implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  private _enableForceSelection = true;
  @Input('appForceSelection')
  get enableForceSelection(): boolean {
    return this._enableForceSelection;
  }
  set enableForceSelection(force: boolean) {
    this._enableForceSelection = force !== false;
  }

  /**
   * propriedade a ser usada para determinar se uma entidade válida foi
   * selecionada
   */
  // tslint:disable-next-line: no-input-rename
  @Input('appForceSelectionId') appSagaForceSelectionId: number | string;

  /** emite quando o input ligado ao autocomplete emite */
  inputCleared: Subject<void> = new Subject<void>();

  /** inscrição nos observables de fechar o painel */
  private _closePanelSubscription: Subscription;

  /** inscrição no observable de opção selecionada */
  private _selectOptionSubscription: Subscription;

  constructor(
    @Host()
    @Self()
    private readonly _autocompleteTrigger: MatAutocompleteTrigger,
    private ngControl: NgControl,
  ) {
    if (!this._autocompleteTrigger) {
      throw new Error(
        // tslint:disable-next-line:max-line-length
        'A diretiva appSagaForceSelection deve estar ligada a um input com o mat-autocomplete associado',
      );
    }
  }

  ngOnInit() {
    if (this.ngControl === undefined) {
      throw Error('inputCtrl @Input should be provided ');
    }

    // aguarda um tempinho antes de inicializar para ter certeza de que os
    // componentes envolvidos no autocomplete estejam todos inicializados. Não é
    // possível usar o  AfterViewInit aqui porque uma diretiva não tem "View",
    // apenas lógica
    setTimeout(() => {
      this._subscribeToClosingActions();
      this._handleSelection();
    }, 100);
  }

  ngOnDestroy(): void {
    if (!!this._closePanelSubscription && !this._closePanelSubscription.closed) {
      this._closePanelSubscription.unsubscribe();
    }

    if (!!this._selectOptionSubscription && !this._selectOptionSubscription.closed) {
      this._selectOptionSubscription.unsubscribe();
    }

    if (!!this.inputCleared && !this.inputCleared.closed) {
      this.inputCleared.complete();
    }
  }

  @HostListener('blur')
  onBlur() {
    if (!this.enableForceSelection) {
      return;
    }

    setTimeout(() => {
      if (
        !this.ngControl.control.value ||
        (this.ngControl.control.value &&
          !this.ngControl.control.value.hasOwnProperty(this.appSagaForceSelectionId))
      ) {
        this.ngControl.control.setValue(null, {emitEvent: false});
        this.inputCleared.next();
      }
    }, 500);
  }

  /**
   * Realiza a assinatura dos observables que emitem quando o painel é fechado
   */
  private _subscribeToClosingActions(): void {
    if (!this.enableForceSelection) {
      return;
    }

    if (this._closePanelSubscription && !this._closePanelSubscription.closed) {
      this._closePanelSubscription.unsubscribe();
    }

    this._closePanelSubscription = this._autocompleteTrigger.autocomplete.closed
      .pipe(withLatestFrom(this._autocompleteTrigger.panelClosingActions))
      .subscribe(
        ([_, e]) => {
          if (!this.enableForceSelection) {
            return;
          }

          const value = this.ngControl.value;
          if ((!e || !e.source) && (!value || !value[this.appSagaForceSelectionId])) {
            this.ngControl.control.setValue(null, {emitEvent: false});
          }
        },
        (err) => this._subscribeToClosingActions(),
        () => this._subscribeToClosingActions(),
      );
  }

  /**
   * Realiza a assinatura do observable que emite quando uma opção é
   * selecionada
   */
  private _handleSelection() {
    // tslint:disable-next-line:max-line-length
    this._selectOptionSubscription = this._autocompleteTrigger.autocomplete.optionSelected.subscribe(
      (e: MatAutocompleteSelectedEvent) => {
        this.ngControl.control.setValue(e.option.value, {emitEvent: false});
      },
    );
  }
}
