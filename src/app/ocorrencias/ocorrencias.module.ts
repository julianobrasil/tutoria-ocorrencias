import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {OcorrenciasRoutingModule} from './ocorrencias-routing.module';

import {OcorrenciasRoutingComponent} from './ocorrencias-routing-component.component';
import {OcorrenciasComponent} from './ocorrencias/ocorrencias.component';

@NgModule({
  declarations: [OcorrenciasComponent, OcorrenciasRoutingComponent],
  imports: [OcorrenciasRoutingModule, SharedModule],
})
export class OcorrenciasModule {}
