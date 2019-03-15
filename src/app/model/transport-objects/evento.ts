import {AbstractDocument} from './abstract-document';
import {Etapa} from './etapa';
import {Interacao, Visibilidade} from './interacao';
import {ObjectReference} from './object-reference';
import {Participante} from './participante';
import {Responsavel} from './responsavel';
import {RotuloDoEvento} from './rotulo-do-evento';
import {TextoFormatado} from './texto-formatado';
import {Tutoria} from './tutoria';

export enum ClassificacaoEvento {
  TUTORIA_TUTOR = 'TUTORIA_TUTOR',
  TUTORIA_GERAL = 'TUTORIA_GERAL',
  OUVIDORIA = 'OUVIDORIA',
  OCORRENCIA_COMUM = 'OCORRENCIA_COMUM',
}

export class Evento extends AbstractDocument {
  data: Date | string = new Date();
  dataRegistro: Date | string = new Date();
  dataUltimaCutucada?: Date | string = new Date();
  descricaoSubTipoEvento = '';
  descricaoTipoEvento = '';
  etapaAtual = '';
  etapas: Etapa[];
  isEtapaNova = false;
  isSolicitacaoMaisDetalhesFeita?: boolean;
  isSolicitacaoMaisDetalhesRespondida?: boolean;
  observacao?: string;
  parecer = '';
  proximaEtapa?: string;
  responsaveis: Responsavel[];
  tutoria: Tutoria;

  /** DAQUI PARA BAIXO SÃO COISAS NOVAS */
  autorEvento?: ObjectReference;
  classificacaoEvento?: ClassificacaoEvento;
  interacoes?: Interacao[];
  participantes?: Participante[];
  titulo?: string;
  textoFormatado?: TextoFormatado;
  cidadeUnidade?: string;
  local?: string;
  visibilidade?: Visibilidade;
  isEncerrado?: boolean;
  // isResolvido = false; => substituído por isEncerrado
  rotulos?: RotuloDoEvento[];

  constructor() {
    super();
    this.interacoes = [];
    this.etapas = [];
    this.isSolicitacaoMaisDetalhesFeita = false;
    this.isSolicitacaoMaisDetalhesRespondida = false;
    this.observacao = '';
    this.participantes = [];
    this.proximaEtapa = '';
    this.responsaveis = [];
  }
}
