import {AbstractDocument} from './abstract-document';
import {Comentario} from './comentario';
import {Etapa} from './etapa';
import {ObjectReference} from './object-reference';
import {Participante} from './participante';
import {Responsavel} from './responsavel';
import {Tutoria} from './tutoria';

/**
 * Os eventos podem, no momento, ser de dois tipos:
 *
 * 1. Criados por tutores
 * 2. Criados por terceiros
 *
 * @export
 * @enum {number}
 */
export enum ModalidadeEvento {
  EVENTO_SIMPLES_GERADO_PELO_TUTOR = 'ACAO_TUTOR',
  EVENTO_SIMPLES_GERADO_POR_TERCEIROS = 'ACAO_TERCEIROS',
}

export class Evento extends AbstractDocument {
  tutoria: Tutoria;
  dataRegistro: Date | string = new Date();
  data: Date | string = new Date();
  dataUltimaCutucada?: Date | string = new Date();
  descricaoTipoEvento = '';
  descricaoSubTipoEvento = '';
  responsaveis: Responsavel[];
  parecer = '';
  observacao?: string;
  etapaAtual = '';
  proximaEtapa?: string;
  isSolicitacaoMaisDetalhesFeita?: boolean;
  isSolicitacaoMaisDetalhesRespondida?: boolean;
  isResolvido = false;
  isEtapaNova = false;
  etapas: Etapa[];

  /** DAQUI PARA BAIXO SÃO COISAS NOVAS */
  modalidadeEvento?: ModalidadeEvento;
  autorEvento?: ObjectReference;
  comentarioMaisRecente?: Date | string;
  comentarios?: Comentario[];
  participantes?: Participante[];
  titulo?: string;

  constructor() {
    super();
    this.observacao = '';
    this.proximaEtapa = '';
    this.isSolicitacaoMaisDetalhesFeita = false;
    this.isSolicitacaoMaisDetalhesRespondida = false;
    this.tutoria = new Tutoria();
    this.etapas = [];
    this.responsaveis = [];
    this.comentarios = [];
    this.participantes = [];
  }
}

Evento['__class'] = 'Evento';
