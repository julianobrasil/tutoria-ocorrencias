import {Action} from '@ngrx/store';

import {
  Evento,
  NovoEventoRequest,
} from '../../../app/model/transport-objects';
import {TipoEvento, Tutoria} from '../../../app/model/transport-objects/';
import {Paginacao} from '../../../app/ocorrencias/ocorrencia-facade.service';

export enum OBTEM_EVENTOS_PAGINADOS {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Obtém eventos paginados run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Obtém eventos paginados success',
}

export enum CONFIGURA_DADOS_PAGINACAO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Configura dados de paginacao run',
}

export enum OBTEM_TIPOS_EVENTOS {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Obtém tipos de eventos run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Obtém tipos de eventos success',
}

export enum OBTEM_EVENTO_POR_ID {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Obtém evento por id run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Obtém evento por id success',
  FAIL = '[DIÁRIO DE TUTORIA:EVENTOS]: Obtém evento por id fail',
}

export enum ALTERA_TIPO_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Altera tipo de evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Altera tipo de evento success',
}

export enum EXCLUI_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Exclui evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Exclui evento success',
}

export enum REABRE_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Reabre evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Reabre evento success',
}

export enum ENCERRA_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Encerra evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Encerra evento success',
}

export enum INSERE_COMENTARIO_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Insere comentário no evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Insere comentário no evento success',
  FAIL = '[DIÁRIO DE TUTORIA:EVENTOS]: Insere comentário no evento fail',
}

export enum CRIA_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Cria evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Cria evento success',
  FAIL = '[DIÁRIO DE TUTORIA:EVENTOS]: Cria evento fail',
}

export enum ALTERA_LOCAL_DO_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Altera local do evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Altera local do evento success',
}

export enum ALTERA_TITULO_DO_EVENTO {
  RUN = '[DIÁRIO DE TUTORIA:EVENTOS]: Altera título do evento run',
  SUCCESS = '[DIÁRIO DE TUTORIA:EVENTOS]: Altera título do evento success',
}

export class ObtemEventosPaginadosRun implements Action {
  readonly type = OBTEM_EVENTOS_PAGINADOS.RUN;
  constructor(public payload: {
    termoDeBusca?: string;
    paginacao: Paginacao;
  }) {}
}

export class ObtemEventosPaginadosSuccess implements Action {
  readonly type = OBTEM_EVENTOS_PAGINADOS.SUCCESS;
  constructor(public payload: {
    eventos: Evento[];
    totalElements: number;
  }) {}
}

export class ConfiguraDadosDePaginacaoRun implements Action {
  readonly type = CONFIGURA_DADOS_PAGINACAO.RUN;
  constructor(public payload: { paginacao: Paginacao; }) {}
}

export class ObtemTiposDeEventosRun implements Action {
  readonly type = OBTEM_TIPOS_EVENTOS.RUN;
}

export class ObtemTiposDeEventosSuccess implements Action {
  readonly type = OBTEM_TIPOS_EVENTOS.SUCCESS;
  constructor(public payload: { tiposEventos: TipoEvento[]; }) {}
}

export class ObtemEventoPorIdRun implements Action {
  readonly type = OBTEM_EVENTO_POR_ID.RUN;
  constructor(public payload: { id: string; }) {}
}

export class ObtemEventoPorIdSuccess implements Action {
  readonly type = OBTEM_EVENTO_POR_ID.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export class ObtemEventoPorIdFail implements Action {
  readonly type = OBTEM_EVENTO_POR_ID.FAIL;
  constructor(public payload: {
    error: any;
    eventoId: string;
  }) {}
}

export class AlteraTipoDeEventoRun implements Action {
  readonly type = ALTERA_TIPO_EVENTO.RUN;
  constructor(public payload: {
    eventoId: string;
    descricaoTipoEvento: string;
    descricaoSubTipoEvento: string;
  }) {}
}

export class AlteraTipoDeEventoSuccess implements Action {
  readonly type = ALTERA_TIPO_EVENTO.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export class ExcluiEventoRun implements Action {
  readonly type = EXCLUI_EVENTO.RUN;
  constructor(public payload: { eventoId: string; }) {}
}

export class ExcluiEventoSuccess implements Action {
  readonly type = EXCLUI_EVENTO.SUCCESS;
  constructor(public payload: { eventoId: string; }) {}
}

export class ReabreEventoRun implements Action {
  readonly type = REABRE_EVENTO.RUN;
  constructor(public payload: {
    eventoId: string;
    textoComentario?: string;
  }) {}
}

export class ReabreEventoSuccess implements Action {
  readonly type = REABRE_EVENTO.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export class EncerraEventoRun implements Action {
  readonly type = ENCERRA_EVENTO.RUN;
  constructor(public payload: {
    eventoId: string;
    textoComentario?: string;
  }) {}
}

export class EncerraEventoSuccess implements Action {
  readonly type = ENCERRA_EVENTO.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export class InsereComentarioRun implements Action {
  readonly type = INSERE_COMENTARIO_EVENTO.RUN;
  constructor(public payload: {
    eventoId: string;
    textoComentario?: string;
  }) {}
}

export class InsereComentarioSuccess implements Action {
  readonly type = INSERE_COMENTARIO_EVENTO.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export class InsereComentarioFail implements Action {
  readonly type = INSERE_COMENTARIO_EVENTO.FAIL;
  constructor(public payload: { error: any; }) {}
}

export class CriaEventoRun implements Action {
  readonly type = CRIA_EVENTO.RUN;
  constructor(public payload: { novoEventoRequest: NovoEventoRequest; }) {}
}

export class CriaEventoSuccess implements Action {
  readonly type = CRIA_EVENTO.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export class CriaEventoFail implements Action {
  readonly type = CRIA_EVENTO.FAIL;
  constructor(public payload: { error: any; }) {}
}

export class AlteraLocalDoEventoRun implements Action {
  readonly type = ALTERA_LOCAL_DO_EVENTO.RUN;
  constructor(public payload: {
    eventoId: string;
    local: string;
  }) {}
}

export class AlteraLocalDoEventoSuccess implements Action {
  readonly type = ALTERA_TITULO_DO_EVENTO.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export class AlteraTituloDoEventoRun implements Action {
  readonly type = ALTERA_TITULO_DO_EVENTO.RUN;
  constructor(public payload: {
    eventoId: string;
    titulo: string;
  }) {}
}

export class AlteraTituloDoEventoSuccess implements Action {
  readonly type = ALTERA_LOCAL_DO_EVENTO.SUCCESS;
  constructor(public payload: { evento: Evento; }) {}
}

export type EventoAction =
    | AlteraLocalDoEventoRun | AlteraLocalDoEventoSuccess |
    AlteraTituloDoEventoRun | AlteraTituloDoEventoSuccess |
    AlteraTipoDeEventoRun | AlteraTipoDeEventoSuccess |
    ConfiguraDadosDePaginacaoRun | EncerraEventoRun | EncerraEventoSuccess |
    ExcluiEventoRun | ExcluiEventoSuccess | InsereComentarioRun |
    InsereComentarioSuccess | ObtemEventoPorIdRun | CriaEventoFail |
    CriaEventoRun | CriaEventoSuccess | ObtemEventoPorIdSuccess |
    ObtemEventoPorIdFail | ObtemEventosPaginadosRun |
    ObtemEventosPaginadosSuccess | ObtemTiposDeEventosRun |
    ObtemTiposDeEventosSuccess | ReabreEventoRun | ReabreEventoSuccess;
