import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from '../auth/guards/auth-guard.service';

import {OcorrenciasRoutingComponent} from './ocorrencias-routing-component.component';
import {OcorrenciasComponent} from './ocorrencias/ocorrencias.component';

const ocorrenciasRoutes: Routes = [
  {
    path: '',
    component: OcorrenciasRoutingComponent,
    canActivate: [AuthGuard],
    children: [{path: '', component: OcorrenciasComponent}],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ocorrenciasRoutes)],
  exports: [RouterModule],
  declarations: [],
  providers: [],
})
export class OcorrenciasRoutingModule {}
