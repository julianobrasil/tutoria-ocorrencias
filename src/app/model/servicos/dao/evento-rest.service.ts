// tslint:disable: max-line-length
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of as observableOf, throwError} from 'rxjs';

import {EVENTOS_EXISTENTES} from '../../../../data/eventos';
import {ROTULOS_EXISTENTES} from '../../../../data/rotulos-dos-eventos';
import {TIPOS_EVENTOS_DISPONIVEIS} from '../../../../data/tipos_eventos';
import {TUTORIAS_EXISTENTES} from '../../../../data/tutorias';
import {AuthService} from '../../../auth/auth.service';
import {FiltrosDeBusca} from '../../../ocorrencias/classes-and-interfaces';
import {
  TipoSubtipoInfo,
} from '../../../ocorrencias/shared/componentes/selecao-de-tipos-de-ocorrencias/tipos-de-ocorrencia-service-adapter';
import {
  FormatadorDeTextoService,
} from '../../../ocorrencias/shared/utilitarios/formatador-de-texto.service';
import {Funcoes} from '../../helper-objects/funcoes-sistema';
import * as fromDocuments from '../../transport-objects';
// tslint:enable: max-line-length

@Injectable({providedIn: 'root'})
export class EventoRestService {
  constructor(private _authService: AuthService,
              private _formatadorDeTextoService: FormatadorDeTextoService) {}

  /**
   * Apaga um evento
   *
   * @param {string} id
   * @returns {Observable<boolean>}
   * @memberof EventoService
   */
  removeEvento(id: string): Observable<boolean> {
    const index = EVENTOS_EXISTENTES.findIndex((evt: fromDocuments.Evento) =>
                                                   evt.id === id);

    EVENTOS_EXISTENTES.splice(index, 1);

    return observableOf(true);
  }

  /**
   * Cria novo evento
   *
   * @param {fromDocuments.NovoEventoRequest} novoEventoRequest
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoService
   */
  criaEvento(novoEventoRequest: fromDocuments.NovoEventoRequest):
      Observable<fromDocuments.Evento> {
    const agora: Date = new Date();

    const tipoEvento = TIPOS_EVENTOS_DISPONIVEIS.find(
        (t: fromDocuments.TipoEvento) =>
            t.id === novoEventoRequest.tipoEventoId);
    const subTipoEvento = tipoEvento.listaSubTipoEvento.find(
        (s: fromDocuments.SubTipoEvento) =>
            s.nomeSubTipoEvento === novoEventoRequest.subTipoEventoNome);

    const responsaveis: fromDocuments.Responsavel[] =
        JSON.parse(JSON.stringify(subTipoEvento.responsaveis));

    const tutoria: fromDocuments.Tutoria =
        novoEventoRequest.tutoriaId ?
            TUTORIAS_EXISTENTES.find((t: fromDocuments.Tutoria) =>
                                         t.id === novoEventoRequest.tutoriaId) :
            null;

    let classificacaoEvento: fromDocuments.ClassificacaoEvento = null;
    let rotuloAplicacao: fromDocuments.RotuloDoEvento;
    if (tutoria) {
      const tutorAtual: fromDocuments.Tutor = tutoria.historicoTutores.find(
          (t: fromDocuments.Tutor) => !t.dataFim);
      classificacaoEvento =
          tutorAtual && tutorAtual.email === this._authService.email ?
              fromDocuments.ClassificacaoEvento.TUTORIA_TUTOR :
              (classificacaoEvento =
                   fromDocuments.ClassificacaoEvento.TUTORIA_GERAL);
      rotuloAplicacao = ROTULOS_EXISTENTES.find(
          (r: fromDocuments.RotuloDoEvento) => r.texto === 'tutoria');
    } else if (novoEventoRequest.classificacaoEvento) {
      classificacaoEvento = novoEventoRequest.classificacaoEvento;
      rotuloAplicacao = ROTULOS_EXISTENTES.find(
          (r: fromDocuments.RotuloDoEvento) => r.texto === 'ouvidoria');
    } else {
      classificacaoEvento = fromDocuments.ClassificacaoEvento.OCORRENCIA_COMUM;
    }

    const evento: fromDocuments.Evento = {
      id: 'EVT' + new Date().getTime(),
      dataRegistro: agora,
      dataUltimaCutucada: agora,
      descricaoTipoEvento: tipoEvento.descricao,
      descricaoSubTipoEvento: subTipoEvento.descricao,
      data: novoEventoRequest.dataEvento,
      etapaAtual: Funcoes.TUTOR.funcaoSistema,
      autorEvento: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      interacoes: [], classificacaoEvento,
      isEtapaNova: false,
      isEncerrado: novoEventoRequest.isResolvido,
      etapas: [],
      local: novoEventoRequest.local,
      parecer: novoEventoRequest.textoFormatado.markdown,
      proximaEtapa: Funcoes.COORDENACAO.funcaoSistema,
      participantes: [
        {
          isAutor: true,
          tipoParticipacao: fromDocuments.TipoParticipacao.TUTOR,
          usuarioRef: {
            code: this._authService.email,
            description: this._authService.nomeUsuario,
          },
        },
      ],
      responsaveis,
      rotulos: rotuloAplicacao ? [rotuloAplicacao] : [],
      titulo: novoEventoRequest.titulo, tutoria,
      textoFormatado: novoEventoRequest.textoFormatado,
      cidadeUnidade: novoEventoRequest.cidadeUnidade ?
                         novoEventoRequest.cidadeUnidade :
                         '',
    };

    EVENTOS_EXISTENTES.push(evento);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   *  Atualiza o tipo de evento
   *
   * @param {string} eventoId
   * @param {string} descricaoTipoEvento
   * @param {string} descricaoSubTipoEvento
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof TutoriaService
   */
  alteraTipoDeEvento(eventoId: string, descricaoTipoEvento: string,
                     descricaoSubTipoEvento: string):
      Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const valorAntigo =
        `${evento.descricaoTipoEvento}:${evento.descricaoSubTipoEvento}`;
    evento.descricaoTipoEvento = descricaoTipoEvento;
    evento.descricaoSubTipoEvento = descricaoSubTipoEvento;

    const agora = new Date();
    // AÇÃO
    const acao: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ALTERA_TIPO,
          auditoriaAcao: {
            valorAntigo,
            valorCorrente:
                `${evento.descricaoTipoEvento}:${evento.descricaoSubTipoEvento}`,
          },
        },
      ],
    };

    evento.interacoes.push(acao);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altera o local do evento
   *
   * @param {string} eventoId
   * @param {string} local
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoRestService
   */
  alteraLocalDoEvento(eventoId: string,
                      local: string): Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const valorAntigo = evento.local;
    evento.local = local;

    const agora = new Date();
    // AÇÃO
    const acao: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ALTERA_LOCAL,
          auditoriaAcao: {
            valorAntigo,
            valorCorrente: evento.local,
          },
        },
      ],
    };

    evento.interacoes.push(acao);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altera a unidade onde um evento ocorre
   *
   * @param {string} eventoId
   * @param {string} unidade
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoRestService
   */
  alteraUnidadeDoEvento(eventoId: string,
                        unidade: string): Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const valorAntigo = evento.cidadeUnidade;
    evento.cidadeUnidade = unidade;

    const agora = new Date();
    // AÇÃO
    const acao: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ALTERA_UNIDADE,
          auditoriaAcao: {
            valorAntigo,
            valorCorrente: evento.cidadeUnidade,
          },
        },
      ],
    };

    evento.interacoes.push(acao);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altera o título de um evento
   *
   * @param {string} eventoId
   * @param {string} titulo
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoRestService
   */
  alteraTituloDoEvento(eventoId: string,
                       titulo: string): Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const valorAntigo = evento.titulo;
    evento.titulo = titulo;

    const agora = new Date();
    // AÇÃO
    const acao: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ALTERA_TITULO,
          auditoriaAcao: {
            valorAntigo,
            valorCorrente: evento.titulo,
          },
        },
      ],
    };

    evento.interacoes.push(acao);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Obtém um evento do banco
   *
   * @param {string} id id do evento
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof TutoriaService
   */
  findEventoById(id: string): Observable<fromDocuments.Evento> {
    const evento =
        EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) => evt.id === id);

    if (!evento) {
      return throwError(id);
    }

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Encontra uma dada página de eventos em que o usuário logado deva ter
   * acesso
   *
   * @param {string} [termToFilter]
   * @param {number} [page]
   * @param {number} [pageSize]
   * @returns {Observable<fromDocuments.EventoPaginado>}
   * @memberof TutoriaService
   */
  findEventosByUsuarioLogado(filtros: FiltrosDeBusca, termToFilter?: string,
                             page?: number, pageSize?: number):
      Observable<fromDocuments.EventoPaginado> {
    let eventos: fromDocuments.Evento[] =
        // tslint:disable-next-line: no-use-before-declare
        TutoriaUtils.filtraEventos(termToFilter, filtros);

    eventos.sort((a, b) => new Date(b.dataRegistro).getTime() -
                           new Date(a.dataRegistro).getTime());

    const totalElements = eventos.length;

    const startIndex = page * pageSize;
    const endIndex = page * pageSize + pageSize;
    eventos = eventos.slice(
        startIndex, endIndex > eventos.length ? eventos.length : endIndex);

    const pagina: fromDocuments.EventoPaginado = {
      content: eventos,
      totalElements,
    };

    return observableOf(pagina);
  }

  reabreEvento(eventoId: string,
               textoComentario?: string): Observable<fromDocuments.Evento> {
    const evento: fromDocuments.Evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

    let agora: Date = new Date();
    evento.isEncerrado = false;

    let comentario: fromDocuments.Interacao;
    if (textoComentario) {
      // COMENTÁRIO, SE EXISTIR
      comentario = {
        autorRef: {
          code: this._authService.email,
          description: this._authService.nomeUsuario,
        },
        dataCriacao: new Date(agora),
        tipoInteracao: fromDocuments.TipoInteracao.COMENTARIO,
        id: '' + new Date(agora).getTime(),
        role: Funcoes.ADMINISTRADOR.funcaoSistema,
        historicoInteracoes: [
          {
            data: new Date(agora),
            texto: {
              markdown: textoComentario,
              semFormatacao:
                  this._formatadorDeTextoService.limpaMarkdown(textoComentario),
              html: this._formatadorDeTextoService.markdownToHtml(
                  textoComentario),
            },
          },
        ],
      };

      evento.interacoes.push(comentario);
    }

    agora = new Date();
    // AÇÃO
    comentario = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.REABRE_OCORRENCIA,
        },
      ],
    };

    evento.interacoes.push(comentario);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  encerraEvento(eventoId: string,
                textoComentario: string): Observable<fromDocuments.Evento> {
    const evento: fromDocuments.Evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

    let agora: Date = new Date();
    evento.isEncerrado = true;

    let comentario: fromDocuments.Interacao;
    if (textoComentario) {
      // COMENTÁRIO, SE EXISTIR
      comentario = {
        autorRef: {
          code: this._authService.email,
          description: this._authService.nomeUsuario,
        },
        dataCriacao: new Date(agora),
        tipoInteracao: fromDocuments.TipoInteracao.COMENTARIO,
        id: '' + new Date(agora).getTime(),
        role: Funcoes.ADMINISTRADOR.funcaoSistema,
        historicoInteracoes: [
          {
            data: new Date(agora),
            texto: {
              markdown: textoComentario,
              semFormatacao:
                  this._formatadorDeTextoService.limpaMarkdown(textoComentario),
              html: this._formatadorDeTextoService.markdownToHtml(
                  textoComentario),
            },
          },
        ],
      };

      evento.interacoes.push(comentario);
    }

    agora = new Date();
    // AÇÃO
    comentario = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ENCERRA_OCORRENCIA,
        },
      ],
    };

    evento.interacoes.push(comentario);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Insere um comentário no evento indicado
   *
   * @param {string} eventoId
   * @param {string} textoComentario
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof TutoriaService
   */
  insereComentario(eventoId: string, textoComentario: string,
                   visibilidade: fromDocuments.Visibilidade):
      Observable<fromDocuments.Evento> {
    if (!textoComentario) {
      return throwError(eventoId);
    }

    const evento: fromDocuments.Evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

    const agora: Date = new Date();

    const comentario: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.COMENTARIO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          texto: {
            markdown: textoComentario,
            semFormatacao:
                this._formatadorDeTextoService.limpaMarkdown(textoComentario),
            html:
                this._formatadorDeTextoService.markdownToHtml(textoComentario),
          },
        },
      ],
      visibilidade,
    };

    evento.interacoes.push(comentario);

    if (!evento.participantes.some(
            (p: fromDocuments.Participante) =>
                p.usuarioRef.code === this._authService.email)) {
      // no servidor é preciso verificar o real papel do participante antes de
      // colocá-lo como convidado
      const participante: fromDocuments.Participante = {
        isAutor: false,
        tipoParticipacao: fromDocuments.TipoParticipacao.GERAL,
        usuarioRef: {
          code: this._authService.email,
          description: this._authService.nomeUsuario,
        },
      };

      evento.participantes.push(participante);
    }

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Exclui interação de um evento
   *
   * @param {string} eventoId
   * @param {string} interacaoId
   * @returns {*}
   * @memberof EventoRestService
   */
  excluiInteracao(eventoId: string, interacaoId: string): any {
    const evento: fromDocuments.Evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

    const index = evento.interacoes.findIndex((i: fromDocuments.Interacao) =>
                                                  i.id === interacaoId);

    if (index > -1) {
      evento.interacoes.splice(index, 1);
    }

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altera a visibilidade de uma interação
   *
   * @param {string} eventoId id do evento
   * @param {string} interacaoId id da interação
   * @param {fromDocuments.Visibilidade} visibilidade visibilidade a ser
   * alterada
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoRestService
   */
  alteraVisibilidadeDaInteracao(eventoId: string, interacaoId: string,
                                visibilidade: fromDocuments.Visibilidade):
      Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const comentario: fromDocuments.Interacao = evento.interacoes.find(
        (interacao: fromDocuments.Interacao) => interacao.id === interacaoId);

    comentario.visibilidade = visibilidade;

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  alteraVisibilidadeDoEvento(eventoId: string,
                             visibilidade: fromDocuments.Visibilidade): any {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const valorAntigo = JSON.stringify(evento.visibilidade);
    evento.visibilidade = visibilidade;

    const agora: Date = new Date();
    // AÇÃO
    const acao: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ALTERA_VISIBILIDADE_EVENTO,
          auditoriaAcao:
              {valorAntigo, valorCorrente: JSON.stringify(evento.visibilidade)},
        },
      ],
    };

    evento.interacoes.push(acao);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altear texto de um comentário
   *
   * @param {string} eventoId id do evento
   * @param {string} interacaoId id da interação
   * @param {fromDocuments.TextoFormatado} textoFormatado texto formatado
   * @memberof EventoRestService
   */
  alteraTextoDeComentario(eventoId: string, interacaoId: string,
                          textoFormatado: fromDocuments.TextoFormatado):
      Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const comentario: fromDocuments.Interacao = evento.interacoes.find(
        (interacao: fromDocuments.Interacao) => interacao.id === interacaoId);

    const historico: fromDocuments.HistoricoInteracao = {
      data: new Date(),
      texto: textoFormatado,
    };

    comentario.historicoInteracoes.push(historico);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altera o parecer do evento
   *
   * @param {string} eventoId
   * @param {fromDocuments.TextoFormatado} textoFormatado
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoRestService
   */
  alteraParecerDoEvento(eventoId: string,
                        textoFormatado: fromDocuments.TextoFormatado):
      Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    evento.parecer = textoFormatado.markdown;

    evento.textoFormatado = textoFormatado;

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altera os participantes de um evento
   *
   * @param {string} eventoId
   * @param {fromDocuments.ObjectReference[]} participantesAdicionados
   * @param {fromDocuments.ObjectReference[]} participantesRemovidos
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoRestService
   */
  alteraParticipantesDoEvento(
      eventoId: string,
      participantesAdicionados: fromDocuments.ObjectReference[],
      participantesRemovidos: fromDocuments.ObjectReference[]):
      Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);
    participantesAdicionados.forEach((or: fromDocuments.ObjectReference) => {
      if (!evento.participantes.some((p: fromDocuments.Participante) =>
                                         p.usuarioRef.code === or.code)) {
        // se for um evento de tutoria, é preciso verificar se o usuário não é
        // algum gestor  que tenha saído da conversa, antes de classificá-lo
        // como um convidado: isso será feito no backend
        const participante: fromDocuments.Participante = {
          isAutor: false,
          tipoParticipacao: fromDocuments.TipoParticipacao.CONVIDADO,
          usuarioRef: or,
        };

        evento.participantes.push(participante);
      }
    });

    participantesRemovidos.forEach((or: fromDocuments.ObjectReference) => {
      let index = evento.participantes.findIndex(
          (p: fromDocuments.Participante) => p.usuarioRef.code === or.code);
      if (index > -1) {
        evento.participantes.splice(index, 1);
      }

      index = evento.responsaveis.findIndex((p: fromDocuments.Responsavel) =>
                                                p.email === or.code);
      if (index > -1) {
        evento.responsaveis.splice(index, 1);
      }
    });

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  /**
   * Altera os responsáveis por um evento
   *
   * @param {string} eventoId
   * @param {fromDocuments.ObjectReference[]} participantesAdicionados
   * @param {fromDocuments.ObjectReference[]} participantesRemovidos
   * @returns {Observable<fromDocuments.Evento>}
   * @memberof EventoRestService
   */
  alteraResponsaveisDoEvento(
      eventoId: string,
      participantesAdicionados: fromDocuments.ObjectReference[],
      participantesRemovidos: fromDocuments.ObjectReference[]):
      Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);
    participantesAdicionados.forEach((or: fromDocuments.ObjectReference) => {
      if (!evento.responsaveis.some((p: fromDocuments.Responsavel) =>
                                        p.email === or.code)) {
        // se for um evento de tutoria, é preciso verificar se o usuário não é
        // algum gestor  que tenha saído da conversa, antes de classificá-lo
        // como um convidado: isso será feito no backend
        const responsavel: fromDocuments.Responsavel = {
          email: or.code,
          nomeResponsavel: or.description,
        };

        evento.responsaveis.push(responsavel);
      }
    });

    participantesAdicionados.forEach((or: fromDocuments.ObjectReference) => {
      if (!evento.participantes.some(
              (p: fromDocuments.Participante) =>
                  p.usuarioRef.code === or.code &&
                  p.tipoParticipacao ===
                      fromDocuments.TipoParticipacao.RESPONSAVEL)) {
        // se o responsável não for participante, é preciso incluí-lo como tal
        const participante: fromDocuments.Participante = {
          isAutor: false,
          tipoParticipacao: fromDocuments.TipoParticipacao.RESPONSAVEL,
          usuarioRef: or,
        };

        evento.participantes.push(participante);
      }
    });

    participantesRemovidos.forEach((or: fromDocuments.ObjectReference) => {
      let index = evento.responsaveis.findIndex(
          (p: fromDocuments.Responsavel) => p.email === or.code);
      if (index > -1) {
        evento.responsaveis.splice(index, 1);
      }

      index = evento.participantes.findIndex(
          (p: fromDocuments.Participante) =>
              p.usuarioRef.code === or.code &&
              p.tipoParticipacao ===
                  fromDocuments.TipoParticipacao.RESPONSAVEL);

      if (index > -1) {
        if (evento.interacoes.some((i: fromDocuments.Interacao) =>
                                       i.autorRef.code === or.code)) {
          evento.participantes[index].tipoParticipacao =
              fromDocuments.TipoParticipacao.CONVIDADO;
        } else {
          evento.participantes.splice(index, 1);
        }
      }
    });

    const agora: Date = new Date();
    const valorAntigo: string = JSON.stringify(participantesRemovidos);
    const valorCorrente: string = JSON.stringify(participantesAdicionados);
    // AÇÃO
    const acao: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ALTERA_RESPONSAVEIS,
          auditoriaAcao: {valorAntigo, valorCorrente},
        },
      ],
    };

    evento.interacoes.push(acao);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }

  alteraRotulosDoEvento(eventoId: string, rotulosAdicionadosIds: string[],
                        rotulosRemovidosIds: string[]):
      Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find((evt: fromDocuments.Evento) =>
                                               evt.id === eventoId);

    const rotulosAdicionados: fromDocuments.RotuloDoEvento[] = [];
    rotulosAdicionadosIds.forEach((id: string) => {
      if (!evento.rotulos.some((r: fromDocuments.RotuloDoEvento) =>
                                   r.id === id)) {
        // se o rótulo não existir, é preciso incluílo no evento
        const rotulo = ROTULOS_EXISTENTES.find(
            (r: fromDocuments.RotuloDoEvento) => r.id === id);
        rotulosAdicionados.push(rotulo);
        evento.rotulos.push(rotulo);
      }
    });

    const rotulosRemovidos: fromDocuments.RotuloDoEvento[] = [];
    rotulosRemovidosIds.forEach((id: string) => {
      const index = evento.rotulos.findIndex(
          (p: fromDocuments.RotuloDoEvento) => p && p.id === id);
      if (index > -1) {
        rotulosRemovidos.push(evento.rotulos[index]);
        evento.rotulos.splice(index, 1);
      }
    });

    const agora: Date = new Date();
    const valorAntigo: string = JSON.stringify(rotulosRemovidos);
    const valorCorrente: string = JSON.stringify(rotulosAdicionados);
    // AÇÃO
    const acao: fromDocuments.Interacao = {
      autorRef: {
        code: this._authService.email,
        description: this._authService.nomeUsuario,
      },
      dataCriacao: new Date(agora),
      tipoInteracao: fromDocuments.TipoInteracao.ACAO,
      id: '' + new Date(agora).getTime(),
      role: Funcoes.ADMINISTRADOR.funcaoSistema,
      historicoInteracoes: [
        {
          data: new Date(agora),
          tipoAcao: fromDocuments.TipoAcao.ALTERA_ROTULO,
          auditoriaAcao: {valorAntigo, valorCorrente},
        },
      ],
    };

    evento.interacoes.push(acao);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }
}

/**
 * TODO(@julianobrasil): ESTA CLASSE PODERÁ SER APAGADA QUANDO FOR PARA O
 * PROJETO, POIS A LÓGICA ABAIXO SERÁ FEITA NO SERVIDOR
 */
class TutoriaUtils {
  static filtraEventos(termToFilter: string,
                       filtros: FiltrosDeBusca): fromDocuments.Evento[] {
    console.log(filtros);
    console.log({termToFilter});
    return EVENTOS_EXISTENTES.filter(
        (evt: fromDocuments.Evento) =>
            // Rótulo de aplicativo...
        TutoriaUtils._rotuloContem(evt, filtros.rotulosAplicativosIds) &&
        // Rótulos que não são de aplicativos...
        TutoriaUtils._rotuloContem(evt, filtros.rotulosIds) &&
        TutoriaUtils._tipoSubtipoContem(evt, filtros.tiposDeOcorrenciasInfo) &&
        TutoriaUtils._cursoContem(evt, filtros.cursosRef) &&
        TutoriaUtils._autorContem(evt, filtros.autorRef) &&
        TutoriaUtils._responsavelContem(evt, filtros.responsaveisRef) &&
        (filtros.isAberta && filtros.isFechada ?
             true :
             (evt.isEncerrado === !filtros.isAberta &&
              evt.isEncerrado === filtros.isFechada)) &&
        (TutoriaUtils._observacaoContem(evt, termToFilter) ||
         TutoriaUtils._ocorrenciaContem(evt, termToFilter) ||
         TutoriaUtils._comentarioContem(evt, termToFilter)));
  }

  private static _observacaoContem(evt: fromDocuments.Evento,
                                   termToFilter: string): boolean {
    if (!termToFilter) {
      return true;
    }

    return evt.observacao &&
           evt.observacao.toUpperCase().includes(termToFilter.toUpperCase());
  }

  private static _ocorrenciaContem(evt: fromDocuments.Evento,
                                   termToFilter: string): boolean {
    if (!termToFilter) {
      return true;
    }

    return (!!evt.textoFormatado.semFormatacao &&
            evt.parecer.toUpperCase().includes(termToFilter.toUpperCase()));
  }

  private static _comentarioContem(evt: fromDocuments.Evento,
                                   termToFilter: string): boolean {
    if (!termToFilter) {
      return true;
    }

    if (!evt.interacoes || !evt.interacoes.length) {
      return false;
    }

    return evt.interacoes.some((c: fromDocuments.Interacao) => {
      termToFilter = termToFilter.toUpperCase();

      c.historicoInteracoes.sort((a, b) => new Date(a.data).getTime() -
                                           new Date(b.data).getTime());
      return (
          !!c.historicoInteracoes && !!c.historicoInteracoes.length &&
          !!c.historicoInteracoes[0] && !!c.historicoInteracoes[0].texto &&
          !!c.historicoInteracoes[0].texto.semFormatacao &&
          c.historicoInteracoes[0].texto.semFormatacao.toUpperCase().includes(
              termToFilter));
    });
  }

  private static _rotuloContem(evt: fromDocuments.Evento,
                               rotulosIds: string[]): boolean {
    if (!(rotulosIds && rotulosIds.length)) {
      return true;
    }

    if (!evt.rotulos || !evt.rotulos.length) {
      return false;
    }

    return evt.rotulos.some((r: fromDocuments.RotuloDoEvento) =>
                                r && rotulosIds.includes(r.id));
  }

  private static _tipoSubtipoContem(evt: fromDocuments.Evento,
                                    tiposDeOcorrenciasInfo:
                                        TipoSubtipoInfo[]): boolean {
    if (!(tiposDeOcorrenciasInfo && tiposDeOcorrenciasInfo.length)) {
      return true;
    }

    return tiposDeOcorrenciasInfo.some(
        (t: TipoSubtipoInfo) =>
            t.descricaoTipo === evt.descricaoTipoEvento &&
            t.descricaoSubtipo === evt.descricaoSubTipoEvento);
  }

  private static _cursoContem(evt: fromDocuments.Evento,
                              cursosRefs: fromDocuments.ObjectReference[]):
      boolean {
    if (!(cursosRefs && cursosRefs.length)) {
      return true;
    }

    if (!evt || !evt.tutoria) {
      return true;
    }

    return (
        evt.tutoria.turmas && evt.tutoria.turmas.length &&
        evt.tutoria.turmas.some(
            (t: fromDocuments.Turma) =>
                t.cursoNome &&
                cursosRefs.some(
                    (c: fromDocuments.ObjectReference) =>
                        t.centroDeCusto.unidade === c.extra.split('::')[0] &&
                        t.centroDeCusto.turno === c.extra.split('::')[1] &&
                        t.cursoNome.toUpperCase().includes(
                            c.description.toUpperCase()))));
  }

  private static _autorContem(evt: fromDocuments.Evento,
                              autorRef: fromDocuments.ObjectReference):
      boolean {
    if (!autorRef) {
      return true;
    }

    return evt.autorEvento.code === autorRef.code;
  }

  private static _responsavelContem(
      evt: fromDocuments.Evento,
      responsaveis: fromDocuments.ObjectReference[]): boolean {
    if (!(responsaveis && responsaveis.length)) {
      return true;
    }

    if (!evt.participantes || !evt.participantes.length) {
      return false;
    }

    return evt.participantes.some(
        (p: fromDocuments.Participante) =>
            p &&
            p.tipoParticipacao === fromDocuments.TipoParticipacao.RESPONSAVEL &&
            responsaveis.some((r: fromDocuments.ObjectReference) =>
                                  r.code === p.usuarioRef.code));
  }

  private static _tutorContem(evt: fromDocuments.Evento,
                              termToFilter: string): boolean {
    if (!evt.tutoria.historicoTutores && !evt.tutoria.historicoTutores.length) {
      return false;
    }

    const tutor = evt.tutoria.historicoTutores.filter((t) => !t.dataFim);

    if (!tutor || !tutor.length) {
      return false;
    }

    termToFilter = termToFilter.toUpperCase();

    return (tutor[0].email.toUpperCase().includes(termToFilter) ||
            (!!tutor[0].nomeTutor &&
             tutor[0].nomeTutor.toUpperCase().includes(termToFilter)));
  }
}
