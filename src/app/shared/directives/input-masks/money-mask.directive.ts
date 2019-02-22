import {Directive, ElementRef, HostListener} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[appMoneyMask]',
})
export class MoneyMaskDirective {
  // private model: NgControl;
  private currency = '$';
  private digitPatternComma = /\d,?/g;
  private digitPatternDot = /\d\.?/g;

  constructor(private model: NgControl, private el: ElementRef) {
    // this.model = model;
    // console.log(model);
  }

  @HostListener('keyup')
  onInputChange() {
    const currentValue = this.model.value;
    const actualValue = this.getActualValue(currentValue);
    const maskedValue = this.getMaskedValue(actualValue);

    // This is the actual binding (unmasked) value
    this.model.viewToModelUpdate(actualValue);

    // This is the displaying (masked) value
    this.model.valueAccessor.writeValue(maskedValue);
  }

  // Returns the actual (unmasked) value
  getActualValue(currentValue: string): string {
    let result = '';

    // Check if something is available to mask
    if (currentValue && currentValue.length > 0) {
      // Check if the entered value is a negative
      if (currentValue.indexOf('-') > -1) {
        result += '-';
      }

      result = currentValue.replace(/\D/g, '');
      result = '' + Number(result);

      const len = result.length;
      if (1 === len) {
        result = result.replace(/(\d)/, '0.0$1');
      } else if (2 === len) {
        result = result.replace(/(\d)/, '0.$1');
      } else if (len > 2) {
        result = result.replace(/(\d{2})$/, '.$1');
      }
    }

    return result;
  }

  // Returns the masked value
  getMaskedValue(actualValue: string): string {
    actualValue = actualValue.replace(/\D/g, '');

    const len = actualValue.length;
    if (1 === len) {
      actualValue = actualValue.replace(/(\d)/, '0,0$1');
    } else if (2 === len) {
      actualValue = actualValue.replace(/(\d)/, '0,$1');
    } else if (len > 2) {
      actualValue = actualValue.replace(/(\d{2})$/, ',$1');
    }
    return actualValue;
  }
}
