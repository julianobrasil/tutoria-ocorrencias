import {AbstractDocument} from './abstract-document';
import {Etapa} from './etapa';
import {Responsavel} from './responsavel';
import {Tutoria} from './tutoria';

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

  constructor() {
    super();
    this.observacao = '';
    this.proximaEtapa = '';
    this.isSolicitacaoMaisDetalhesFeita = false;
    this.isSolicitacaoMaisDetalhesRespondida = false;
    this.tutoria = new Tutoria();
    this.etapas = [];
    this.responsaveis = [];
  }
}

Evento['__class'] = 'Evento';
