// tslint:disable:max-line-length
import {NgModule} from '@angular/core';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import * as fromStore from '../../store/diario-de-tutoria';
import {effects} from '../../store/diario-de-tutoria/effects';
import {SharedModule} from '../shared/shared.module';

import {
  FiltroDeOcorrenciasComponent,
} from './lista-de-ocorrencias/filtro-de-ocorrencias/filtro-de-ocorrencias.component';
import {
  ListaDeOcorrenciasComponent,
} from './lista-de-ocorrencias/lista-de-ocorrencias.component';
import {
  OcorrenciaPopoverDeEscolhaComponent,
} from './lista-de-ocorrencias/ocorrencia-popover-de-escolha/ocorrencia-popover-de-escolha.component';
import {
  OcorrenciaResumoComponent,
} from './lista-de-ocorrencias/ocorrencia-resumo/ocorrencia-resumo.component';
import {
  AcoesLigadasANovoComentarioComponent,
} from './ocorrencia-detalhes/acoes-ligadas-a-novo-comentario/acoes-ligadas-a-novo-comentario.component';
import {
  OcorrenciaAcaoComponent,
} from './ocorrencia-detalhes/ocorrencia-acao/ocorrencia-acao.component';
import {
  OcorrenciaComentarioComponent,
} from './ocorrencia-detalhes/ocorrencia-comentario/ocorrencia-comentario.component';
import {
  OcorrenciaDetalhesConfiguracoesAcoesComponent,
} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-acoes/ocorrencia-detalhes-configuracoes-acoes.component';
import {
  OcorrenciaDetalhesConfiguracoesParticipantesComponent,
} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-participantes/ocorrencia-detalhes-configuracoes-participantes.component';
import {
  OcorrenciaDetalhesConfiguracoesResponsaveisComponent,
} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-responsaveis/ocorrencia-detalhes-configuracoes-responsaveis.component';
import {
  OcorrenciaDetalhesConfiguracoesRotulosComponent,
} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-rotulos/ocorrencia-detalhes-configuracoes-rotulos.component';
import {
  OcorrenciaDetalhesConfiguracoesComponent,
} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes.component';
import {
  OcorrenciaDetalhesTituloComponent,
} from './ocorrencia-detalhes/ocorrencia-detalhes-titulo/ocorrencia-detalhes-titulo.component';
import {
  OcorrenciaDetalhesComponent,
} from './ocorrencia-detalhes/ocorrencia-detalhes.component';
import {
  OcorrenciaFormularioSomenteLeituraComponent,
} from './ocorrencia-detalhes/ocorrencia-formulario-somente-leitura/ocorrencia-formulario-somente-leitura.component';
import {
  OcorrenciaFormularioComponent,
} from './ocorrencia-formulario/ocorrencia-formulario.component';
import {
  OcorrenciasRoutingComponent,
} from './ocorrencias-routing-component.component';
import {OcorrenciasRoutingModule} from './ocorrencias-routing.module';
import {OcorrenciasComponent} from './ocorrencias/ocorrencias.component';
import {
  LocalDialogComponent,
} from './shared/componentes/dialogos/local-dialog/local-dialog.component';
import {
  TipoSubtipoDeEventoDialogComponent,
} from './shared/componentes/dialogos/tipo-subtipo-de-evento-dialog/tipo-subtipo-de-evento-dialog.component';
import {
  TituloDialogComponent,
} from './shared/componentes/dialogos/titulo-dialog/titulo-dialog.component';
import {
  OcorrenciaAvatarComponent,
} from './shared/componentes/ocorrencia-avatar/ocorrencia-avatar.component';
import {
  OcorrenciaBagdeComponent,
} from './shared/componentes/ocorrencia-bagde/ocorrencia-bagde.component';
import {
  OcorrenciaMenuComponent,
} from './shared/componentes/ocorrencia-menu/ocorrencia-menu.component';
import {
  OcorrenciaRotuloComponent,
} from './shared/componentes/ocorrencia-rotulo/ocorrencia-rotulo.component';
import {
  TempoDecorridoComponent,
} from './shared/componentes/tempo-decorrido/tempo-decorrido.component';
import {
  TipoSubtipoDeEventoComponent,
} from './shared/componentes/tipo-subtipo-de-evento/tipo-subtipo-de-evento.component';
import {AcaoRealizadaPipe} from './shared/pipes/acao-realizada.pipe';
import {CompilaMarkdownPipe} from './shared/pipes/compila-markdown.pipe';
import {CorDeFundoPorTipoPipe} from './shared/pipes/cor-de-fundo-por-tipo.pipe';
import {
  FiltraParticipantesRepetidosPipe,
} from './shared/pipes/filtra-participantes-repetidos.pipe';
import {FiltraResponsaveisPipe} from './shared/pipes/filtra-responsaveis.pipe';
import {
  InteracaoMaisRecentePipe,
} from './shared/pipes/interacao-mais-recente.pipe';
import {
  InteracoesPorOrdemCronologicaPipe,
} from './shared/pipes/interacoes-por-ordem-cronologica.pipe';
import {
  IsTextoDoAvatarBrancoPipe,
} from './shared/pipes/is-texto-do-avatar-branco.pipe';
import {LabelPorTipoPipe} from './shared/pipes/label-por-tipo.pipe';
import {LastDividerClassesPipe} from './shared/pipes/last-divider-classes.pipe';
import {NomeDeTurmaPipe} from './shared/pipes/nome-de-turma.pipe';
import {
  NumeroDeParticipantesPipe,
} from './shared/pipes/numero-de-participantes.pipe';
import {ObtemCorDoAvatarPipe} from './shared/pipes/obtem-cor-do-avatar.pipe';
import {SomenteComentariosPipe} from './shared/pipes/somente-comentarios.pipe';
import {TemaDoRotuloPipe} from './shared/pipes/tema-do-rotulo.pipe';
import {TempoDecorridoPipe} from './shared/pipes/tempo-decorrido.pipe';
import {TutorAtualPipe} from './shared/pipes/tutor-atual.pipe';
import {TutoriaTurmasPipe} from './shared/pipes/tutoria-turmas.pipe';

@NgModule({
  declarations: [
    /** COMPONENTES */
    AcoesLigadasANovoComentarioComponent,
    FiltroDeOcorrenciasComponent,
    ListaDeOcorrenciasComponent,
    OcorrenciaAcaoComponent,
    OcorrenciaAvatarComponent,
    OcorrenciaBagdeComponent,
    OcorrenciaComentarioComponent,
    OcorrenciaDetalhesComponent,
    OcorrenciaDetalhesConfiguracoesAcoesComponent,
    OcorrenciaDetalhesConfiguracoesComponent,
    OcorrenciaDetalhesConfiguracoesParticipantesComponent,
    OcorrenciaDetalhesConfiguracoesResponsaveisComponent,
    OcorrenciaDetalhesConfiguracoesRotulosComponent,
    OcorrenciaDetalhesTituloComponent,
    OcorrenciaFormularioComponent,
    OcorrenciaFormularioSomenteLeituraComponent,
    OcorrenciaMenuComponent,
    OcorrenciaPopoverDeEscolhaComponent,
    OcorrenciaResumoComponent,
    OcorrenciaRotuloComponent,
    OcorrenciasComponent,
    OcorrenciasRoutingComponent,
    TempoDecorridoComponent,
    TipoSubtipoDeEventoComponent,

    /** COMPONENTES - DIALOGOS */
    LocalDialogComponent,
    TipoSubtipoDeEventoDialogComponent,
    TituloDialogComponent,

    /** PIPES */
    AcaoRealizadaPipe,
    CompilaMarkdownPipe,
    CorDeFundoPorTipoPipe,
    FiltraParticipantesRepetidosPipe,
    FiltraResponsaveisPipe,
    InteracaoMaisRecentePipe,
    InteracoesPorOrdemCronologicaPipe,
    IsTextoDoAvatarBrancoPipe,
    LabelPorTipoPipe,
    LastDividerClassesPipe,
    NomeDeTurmaPipe,
    NumeroDeParticipantesPipe,
    ObtemCorDoAvatarPipe,
    SomenteComentariosPipe,
    TemaDoRotuloPipe,
    TempoDecorridoPipe,
    TutorAtualPipe,
    TutoriaTurmasPipe,
  ],
  entryComponents: [
    LocalDialogComponent,
    TipoSubtipoDeEventoDialogComponent,
    TituloDialogComponent,
  ],
  imports: [
    OcorrenciasRoutingModule,
    SharedModule,

    /** ngrx */
    StoreModule.forFeature('DIARIO_DE_TUTORIA', fromStore.REDUCERS.reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [OcorrenciaDetalhesComponent, OcorrenciaFormularioComponent],
})
export class OcorrenciasModule {
}
