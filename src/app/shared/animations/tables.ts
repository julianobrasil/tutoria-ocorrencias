import { animate, animation, keyframes, query, stagger, style } from '@angular/animations';

export const rowsAnimation = animation([
    query(':enter', style({ opacity: 0 }), { optional: true }),

    query(':enter', stagger('100ms', [
        animate('.6s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
        ]))]), { optional: true }),
]);

export const rowsAnimationWithExclusion = animation([
    query(':enter', style({ opacity: 0 }), { optional: true }),

    query(':enter', stagger('100ms', [
        animate('.6s ease-in', keyframes([
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 1, transform: 'translateY(0)', offset: 1.0 }),
        ]))]), { optional: true }),
    query(':leave', stagger('100ms', [
        animate('.6s ease-out', keyframes([
            style({ opacity: 1, transform: 'translateY(0)', offset: 0 }),
            style({ opacity: .5, transform: 'translateY(35px)', offset: 0.3 }),
            style({ opacity: 0, transform: 'translateY(-75%)', offset: 1.0 }),
        ]))]), { optional: true }),
]);
