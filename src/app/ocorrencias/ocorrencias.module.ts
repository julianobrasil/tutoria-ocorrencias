// tslint:disable:max-line-length
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';
import {OcorrenciasRoutingModule} from './ocorrencias-routing.module';

/** COMPONENTES */
import {FiltroDeOcorrenciasComponent} from './lista-de-ocorrencias/filtro-de-ocorrencias/filtro-de-ocorrencias.component';
import {ListaDeOcorrenciasComponent} from './lista-de-ocorrencias/lista-de-ocorrencias.component';
import {OcorrenciaResumoComponent} from './lista-de-ocorrencias/ocorrencia-resumo/ocorrencia-resumo.component';
import {OcorrenciasRoutingComponent} from './ocorrencias-routing-component.component';
import {OcorrenciasComponent} from './ocorrencias/ocorrencias.component';

/** PIPES */
import {TempoDecorridoPipe} from './pipes/tempo-decorrido.pipe';
import {TutorAtualPipe} from './pipes/tutor-atual.pipe';

@NgModule({
  declarations: [
    FiltroDeOcorrenciasComponent,
    ListaDeOcorrenciasComponent,
    OcorrenciaResumoComponent,
    OcorrenciasComponent,
    OcorrenciasRoutingComponent,

    TutorAtualPipe,

    TempoDecorridoPipe,
  ],
  imports: [OcorrenciasRoutingModule, SharedModule],
})
export class OcorrenciasModule {}
