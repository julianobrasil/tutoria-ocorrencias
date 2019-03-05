import {animate, style, transition, trigger} from '@angular/animations';

export const enterFormAnimation = trigger('enterForm', [
  transition('void => *', [style({transform: 'translateX(0) scale(0)'}), animate(400)]),
  transition('* => void', [
    style({transform: '*'}),
    animate(400, style({transform: 'translateX(0) scale(0)'})),
  ]),
]);
