import {Directive, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';

@Directive({
  selector: '[appUppercase]',
})
export class UppercaseDirective implements OnInit {
  @Input() appUppercase: string;
  @Output() appUppercaseChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {
    this.appUppercase = this.appUppercase || '';
    this.format(this.appUppercase);
  }

  @HostListener('input', ['$event.target.value'])
  format(value) {
    value = value.toUpperCase();
    this.appUppercaseChange.next(value);
  }
}
