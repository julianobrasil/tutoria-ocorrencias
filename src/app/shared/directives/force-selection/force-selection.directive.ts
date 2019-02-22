import {Directive, Host, Input, OnDestroy, OnInit, Self} from '@angular/core';
import {NgControl} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
} from '@angular/material';

import {Subscription} from 'rxjs';

@Directive({
  selector: '[appForceSelection]',
})
export class ForceSelectionDirective implements OnInit, OnDestroy {
  subscription: Subscription;

  constructor(
    @Host()
    @Self()
    private readonly _autocompleteTrigger: MatAutocompleteTrigger,
    private ngControl: NgControl,
  ) {}

  ngOnInit() {
    if (this.ngControl === undefined) {
      throw Error('inputCtrl @Input should be provided ');
    }

    setTimeout(() => {
      this.subscribeToClosingActions();
      this.handleSelection();
    }, 100);
  }

  ngOnDestroy(): void {
    if (!!this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  private subscribeToClosingActions(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }

    this.subscription = this._autocompleteTrigger.panelClosingActions.subscribe(
      (e) => {
        if (!e || !e.source) {
          this.ngControl.control.setValue(null);
        }
      },
      (err) => this.subscribeToClosingActions(),
      () => this.subscribeToClosingActions(),
    );
  }

  private handleSelection() {
    this._autocompleteTrigger.autocomplete.optionSelected.subscribe(
      (e: MatAutocompleteSelectedEvent) => {
        this.ngControl.control.setValue(e.option.value);
      },
    );
  }
}
