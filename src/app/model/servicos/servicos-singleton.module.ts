import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';

import {GeradorIdService} from './gerador-id.service';
import {ImodbService} from './imodb.service';

@NgModule({
  imports: [CommonModule],
  declarations: [],
})
export class ServicosSingletonModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicosSingletonModule,
      providers: [GeradorIdService, ImodbService],
    };
  }

  constructor(
    @Optional()
    @SkipSelf()
    parentModule: ServicosSingletonModule,
  ) {
    if (parentModule) {
      throw new Error('ServicosSingletonModule is already loaded. Import it in the AppModule only');
    }
  }
}
