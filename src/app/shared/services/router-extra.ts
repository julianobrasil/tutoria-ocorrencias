import {Injectable} from '@angular/core';
import {NavigationEnd, Router, RouterEvent} from '@angular/router';

/** A router wrapper, adding extra functions. */
@Injectable({providedIn: 'root'})
export class RouterExtraService {
  private _urlAnterior: string = undefined;
  private _urlCorrente: string = undefined;

  constructor(private router: Router) {
    this._urlCorrente = this.router.url;
    router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this._urlAnterior = this._urlCorrente;
        this._urlCorrente = event.url;
      };
    });
  }

  getUrlAnterior() {
    return this._urlAnterior;
  }
}