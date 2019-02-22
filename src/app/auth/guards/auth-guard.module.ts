import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {AuthGuard} from './auth-guard.service';

@NgModule({
  imports: [CommonModule],
})
export class AuthGuardModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthGuardModule,
      providers: [AuthGuard],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AuthGuardModule,
  ) {
    if (parentModule) {
      throw new Error('AuthGuardModule is already loaded. Import it in the AppModule only');
    }
  }
}
