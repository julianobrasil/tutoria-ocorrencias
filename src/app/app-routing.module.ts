import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './auth/guards/auth-guard.service';

const appRoutes: Routes = [
  {
    path: 'ocorrencia',
    loadChildren: './ocorrencias/ocorrencias.module#OcorrenciasModule',
    canLoad: [AuthGuard],
  },
  // {path: '', redirectTo: 'ocorrencia', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {enableTracing: true})],
  exports: [RouterModule],
  declarations: [],
  providers: [],
})
export class AppRoutingModule {}
