// tslint:disable:max-line-length
import {NgModule} from '@angular/core';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import * as fromStore from '../../store/diario-de-tutoria';
import {effects} from '../../store/diario-de-tutoria/effects';
import {SharedModule} from '../shared/shared.module';

import {ListaDeOcorrenciasSearchBarComponent} from './lista-de-ocorrencias-search-bar/lista-de-ocorrencias-search-bar.component';
import {SearchBarFiltroCursoComponent} from './lista-de-ocorrencias-search-bar/search-bar-filtro-curso/search-bar-filtro-curso.component';
import {SearchBarFiltroPessoaComponent} from './lista-de-ocorrencias-search-bar/search-bar-filtro-pessoa/search-bar-filtro-pessoa.component';
import {SearchBarFiltroRotuloComponent} from './lista-de-ocorrencias-search-bar/search-bar-filtro-rotulo/search-bar-filtro-rotulo.component';
import {SearchBarFiltroTiposDeOcorrenciasComponent} from './lista-de-ocorrencias-search-bar/search-bar-filtro-tipos-de-ocorrencias/search-bar-filtro-tipos-de-ocorrencias.component';
import {FiltroDeOcorrenciasComponent} from './lista-de-ocorrencias/filtro-de-ocorrencias/filtro-de-ocorrencias.component';
import {ListaDeOcorrenciasComponent} from './lista-de-ocorrencias/lista-de-ocorrencias.component';
import {OcorrenciaResumoComponent} from './lista-de-ocorrencias/ocorrencia-resumo/ocorrencia-resumo.component';
import {AcoesLigadasANovoComentarioComponent} from './ocorrencia-detalhes/acoes-ligadas-a-novo-comentario/acoes-ligadas-a-novo-comentario.component';
import {OcorrenciaAcaoComponent} from './ocorrencia-detalhes/ocorrencia-acao/ocorrencia-acao.component';
import {OcorrenciaComentarioEdicaoComponent} from './ocorrencia-detalhes/ocorrencia-comentario/ocorrencia-comentario-edicao/ocorrencia-comentario-edicao.component';
import {OcorrenciaComentarioVisualizacaoComponent} from './ocorrencia-detalhes/ocorrencia-comentario/ocorrencia-comentario-visualizacao/ocorrencia-comentario-visualizacao.component';
import {OcorrenciaComentarioComponent} from './ocorrencia-detalhes/ocorrencia-comentario/ocorrencia-comentario.component';
import {OcorrenciaDetalhesConfiguracoesAcoesComponent} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-acoes/ocorrencia-detalhes-configuracoes-acoes.component';
import {OcorrenciaDetalhesConfiguracoesParticipantesComponent} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-participantes/ocorrencia-detalhes-configuracoes-participantes.component';
import {OcorrenciaDetalhesConfiguracoesResponsaveisComponent} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-responsaveis/ocorrencia-detalhes-configuracoes-responsaveis.component';
import {OcorrenciaDetalhesConfiguracoesRotulosComponent} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes-rotulos/ocorrencia-detalhes-configuracoes-rotulos.component';
import {OcorrenciaDetalhesConfiguracoesComponent} from './ocorrencia-detalhes/ocorrencia-detalhes-configuracoes/ocorrencia-detalhes-configuracoes.component';
import {OcorrenciaDetalhesTituloComponent} from './ocorrencia-detalhes/ocorrencia-detalhes-titulo/ocorrencia-detalhes-titulo.component';
import {OcorrenciaDetalhesComponent} from './ocorrencia-detalhes/ocorrencia-detalhes.component';
import {OcorrenciaFormularioSomenteLeituraComponent} from './ocorrencia-detalhes/ocorrencia-formulario-somente-leitura/ocorrencia-formulario-somente-leitura.component';
import {OcorrenciaFormularioComponent} from './ocorrencia-formulario/ocorrencia-formulario.component';
import {OcorrenciasRoutingComponent} from './ocorrencias-routing-component.component';
import {OcorrenciasRoutingModule} from './ocorrencias-routing.module';
import {OcorrenciasComponent} from './ocorrencias/ocorrencias.component';
import {LocalDialogComponent} from './shared/componentes/dialogos/local-dialog/local-dialog.component';
import {TipoSubtipoDeEventoDialogComponent} from './shared/componentes/dialogos/tipo-subtipo-de-evento-dialog/tipo-subtipo-de-evento-dialog.component';
import {TituloDialogComponent} from './shared/componentes/dialogos/titulo-dialog/titulo-dialog.component';
import {UnidadeDialogComponent} from './shared/componentes/dialogos/unidade-dialog/unidade-dialog.component';
import {OcorrenciaAcaoLinhaAlteracaoResponsaveisComponent} from './shared/componentes/ocorrencia-acao-linha-alteracao-responsaveis/ocorrencia-acao-linha-alteracao-responsaveis.component';
import {OcorrenciaAcaoLinhaAlteracaoRotuloComponent} from './shared/componentes/ocorrencia-acao-linha-alteracao-rotulo/ocorrencia-acao-linha-alteracao-rotulo.component';
import {OcorrenciaAvatarComponent} from './shared/componentes/ocorrencia-avatar/ocorrencia-avatar.component';
import {OcorrenciaBagdeComponent} from './shared/componentes/ocorrencia-bagde/ocorrencia-bagde.component';
import {OcorrenciaMenuComponent} from './shared/componentes/ocorrencia-menu/ocorrencia-menu.component';
import {OcorrenciaPopoverDeEscolhaComponent} from './shared/componentes/ocorrencia-popover-de-escolha/ocorrencia-popover-de-escolha.component';
import {OcorrenciaRotuloComponent} from './shared/componentes/ocorrencia-rotulo/ocorrencia-rotulo.component';
import {SearchBarBotaoFiltroComponent} from './shared/componentes/search-bar-botao-filtro/search-bar-botao-filtro.component';
import {SelecaoDeCursosComponent} from './shared/componentes/selecao-de-cursos/selecao-de-cursos.component';
import {SelecaoDePessoasComponent} from './shared/componentes/selecao-de-pessoas/selecao-de-pessoas.component';
import {SelecaoDeRotulosComponent} from './shared/componentes/selecao-de-rotulos/selecao-de-rotulos.component';
import {SelecaoDeTiposDeOcorrenciasComponent} from './shared/componentes/selecao-de-tipos-de-ocorrencias/selecao-de-tipos-de-ocorrencias.component';
import {TempoDecorridoComponent} from './shared/componentes/tempo-decorrido/tempo-decorrido.component';
import {TipoSubtipoDeEventoComponent} from './shared/componentes/tipo-subtipo-de-evento/tipo-subtipo-de-evento.component';
import {UsuarioDetalhesComponent} from './shared/componentes/usuario-detalhes/usuario-detalhes.component';

import {AcaoRealizadaPipe} from './shared/pipes/acao-realizada.pipe';
import {BarraDeFilragemFiltroAtivadoPipe} from './shared/pipes/barra-de-filragem-filtro-ativado.pipe';
import {CompilaMarkdownPipe} from './shared/pipes/compila-markdown.pipe';
import {CorDeFundoPorTipoPipe} from './shared/pipes/cor-de-fundo-por-tipo.pipe';
import {ExtraiVisibilidadeEventoPipe} from './shared/pipes/extrai-visibilidade-evento.pipe';
import {FiltraParticipantesRepetidosPipe} from './shared/pipes/filtra-participantes-repetidos.pipe';
import {FiltraResponsaveisPipe} from './shared/pipes/filtra-responsaveis.pipe';
import {FiltrosDeBuscaToListaDeOcorrenciasSearchBarComponentChangePipe} from './shared/pipes/filtros-de-busca-to-lista-de-ocorrencias-search-bar-component-change.pipe';
import {InteracaoMaisRecentePipe} from './shared/pipes/interacao-mais-recente.pipe';
import {InteracoesPorOrdemCronologicaPipe} from './shared/pipes/interacoes-por-ordem-cronologica.pipe';
import {IsRotuloImexivelPipe} from './shared/pipes/is-rotulo-imexivel.pipe';
import {IsTextoDoAvatarBrancoPipe} from './shared/pipes/is-texto-do-avatar-branco.pipe';
import {IsUsuarioImexivelPipe} from './shared/pipes/is-usuario-imexivel.pipe';
import {LabelPorTipoPipe} from './shared/pipes/label-por-tipo.pipe';
import {LastDividerClassesPipe} from './shared/pipes/last-divider-classes.pipe';
import {NegritaOcorrenciasPipe} from './shared/pipes/negrita-ocorrencias.pipe';
import {NomeDeTurmaPipe} from './shared/pipes/nome-de-turma.pipe';
import {NumeroDeParticipantesPipe} from './shared/pipes/numero-de-participantes.pipe';
import {ObtemCorDoAvatarPipe} from './shared/pipes/obtem-cor-do-avatar.pipe';
import {ObtemHistoricoComentarioMaisRecentePipe} from './shared/pipes/obtem-historico-comentario-mais-recente.pipe';
import {OrdenaRotulosPipe} from './shared/pipes/ordena-rotulos.pipe';
import {ParticipantesToObjectReferencesPipe} from './shared/pipes/participantes-to-object-references.pipe';
import {SafeHtmlPipe} from './shared/pipes/safe-html.pipe';
import {SomenteComentariosPipe} from './shared/pipes/somente-comentarios.pipe';
import {TemaDoRotuloPipe} from './shared/pipes/tema-do-rotulo.pipe';
import {TempoDecorridoPipe} from './shared/pipes/tempo-decorrido.pipe';
import {TextoDeLimiteDeParticipantesEscolhidosPipe} from './shared/pipes/texto-de-limite-de-participantes-escolhidos.pipe';
import {TutorAtualPipe} from './shared/pipes/tutor-atual.pipe';
import {TutoriaTurmasPipe} from './shared/pipes/tutoria-turmas.pipe';
import {UsuariosImexiveisPipe} from './shared/pipes/usuarios-imexiveis.pipe';

@NgModule({
  declarations: [
    /** COMPONENTES */
    AcoesLigadasANovoComentarioComponent,
    FiltroDeOcorrenciasComponent,
    ListaDeOcorrenciasComponent,
    ListaDeOcorrenciasSearchBarComponent,
    OcorrenciaAcaoComponent,
    OcorrenciaAcaoLinhaAlteracaoResponsaveisComponent,
    OcorrenciaAcaoLinhaAlteracaoRotuloComponent,
    OcorrenciaAvatarComponent,
    OcorrenciaBagdeComponent,
    OcorrenciaComentarioComponent,
    OcorrenciaComentarioEdicaoComponent,
    OcorrenciaComentarioVisualizacaoComponent,
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
    SearchBarBotaoFiltroComponent,
    SearchBarFiltroCursoComponent,
    SearchBarFiltroPessoaComponent,
    SearchBarFiltroRotuloComponent,
    SearchBarFiltroTiposDeOcorrenciasComponent,
    SelecaoDeCursosComponent,
    SelecaoDePessoasComponent,
    SelecaoDeRotulosComponent,
    SelecaoDeTiposDeOcorrenciasComponent,
    TempoDecorridoComponent,
    TipoSubtipoDeEventoComponent,
    UnidadeDialogComponent,
    UsuarioDetalhesComponent,

    /** COMPONENTES - DIALOGOS */
    LocalDialogComponent,
    TipoSubtipoDeEventoDialogComponent,
    TituloDialogComponent,

    /** PIPES */
    AcaoRealizadaPipe,
    BarraDeFilragemFiltroAtivadoPipe,
    CompilaMarkdownPipe,
    CorDeFundoPorTipoPipe,
    ExtraiVisibilidadeEventoPipe,
    FiltraParticipantesRepetidosPipe,
    FiltraResponsaveisPipe,
    FiltrosDeBuscaToListaDeOcorrenciasSearchBarComponentChangePipe,
    InteracaoMaisRecentePipe,
    InteracoesPorOrdemCronologicaPipe,
    IsRotuloImexivelPipe,
    IsTextoDoAvatarBrancoPipe,
    IsUsuarioImexivelPipe,
    LabelPorTipoPipe,
    LastDividerClassesPipe,
    NegritaOcorrenciasPipe,
    NomeDeTurmaPipe,
    NumeroDeParticipantesPipe,
    ObtemCorDoAvatarPipe,
    ObtemHistoricoComentarioMaisRecentePipe,
    OrdenaRotulosPipe,
    ParticipantesToObjectReferencesPipe,
    SafeHtmlPipe,
    SomenteComentariosPipe,
    TemaDoRotuloPipe,
    TempoDecorridoPipe,
    TextoDeLimiteDeParticipantesEscolhidosPipe,
    TutorAtualPipe,
    TutoriaTurmasPipe,
    UsuariosImexiveisPipe,
  ],
  entryComponents: [
    LocalDialogComponent,
    TipoSubtipoDeEventoDialogComponent,
    TituloDialogComponent,
    UnidadeDialogComponent,
  ],
  imports: [
    OcorrenciasRoutingModule,
    SharedModule,
    CKEditorModule,

    /** ngrx */
    StoreModule.forFeature('DIARIO_DE_TUTORIA', fromStore.REDUCERS.reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [OcorrenciaDetalhesComponent, OcorrenciaFormularioComponent],
})
export class OcorrenciasModule {}
