import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {AuthService} from './auth.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: AuthModule,
      providers: [AuthService],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: AuthModule,
  ) {
    if (parentModule) {
      throw new Error('AuthModule is already loaded. Import it in the AppModule only');
    }
  }
}
