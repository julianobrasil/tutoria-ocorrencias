import {HttpClient, HttpErrorResponse, HttpParams, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, of as observableOf, of, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {FormatadorDeTextoService} from 'src/app/ocorrencias/shared/utilitarios/formatador-de-texto.service';
import {TIPOS_EVENTOS_DISPONIVEIS} from 'src/data/tipos_eventos';

import {EVENTOS_EXISTENTES} from '../../../../data/eventos';
import {TUTORIAS_EXISTENTES} from '../../../../data/tutorias';
import {AuthService} from '../../../auth/auth.service';
import {URL} from '../../helper-objects/constantes';
import {Funcoes} from '../../helper-objects/funcoes-sistema';
import * as fromDocuments from '../../transport-objects';
import {ClassificacaoEvento, TipoParticipacao} from '../../transport-objects';

@Injectable({providedIn: 'root'})
export class EventoRestService {
  constructor(
      private _authService: AuthService, private _http: HttpClient,
      private _formatadorDeTextoService: FormatadorDeTextoService) {}

  /**
   * Apaga um evento
   *
   * @param {string} id
   * @returns {Observable<boolean>}
   * @memberof EventoService
   */
  removeEvento(id: string): Observable<boolean> {
    const index = EVENTOS_EXISTENTES.findIndex(
        (evt: fromDocuments.Evento) => evt.id === id);

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

    const tutoria: fromDocuments.Tutoria = novoEventoRequest.tutoriaId ?
        TUTORIAS_EXISTENTES.find(
            (t: fromDocuments.Tutoria) =>
                t.id === novoEventoRequest.tutoriaId) :
        null;

    let classificacaoEvento: ClassificacaoEvento = null;
    if (tutoria) {
      const tutorAtual: fromDocuments.Tutor =
          tutoria.historicoTutores.find((t: fromDocuments.Tutor) => !t.dataFim);
      if (tutorAtual && tutorAtual.email === this._authService.email) {
        classificacaoEvento = ClassificacaoEvento.TUTORIA_TUTOR;
      } else {
        classificacaoEvento = ClassificacaoEvento.TUTORIA_GERAL;
      }
    } else if (novoEventoRequest.classificacaoEvento) {
      classificacaoEvento = novoEventoRequest.classificacaoEvento;
    } else {
      classificacaoEvento = ClassificacaoEvento.OCORRENCIA_COMUM;
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
      interacoes: [],
      classificacaoEvento,
      isEtapaNova: false,
      isResolvido: novoEventoRequest.isResolvido,
      etapas: [],
      observacao: novoEventoRequest.observacao,
      parecer: novoEventoRequest.textoFormatado.markdown,
      proximaEtapa: Funcoes.COORDENACAO.funcaoSistema,
      participantes: [{
        isAutor: true,
        tipoParticipacao: TipoParticipacao.TUTOR,
        usuarioRef: {
          code: this._authService.email,
          description: this._authService.nomeUsuario,
        }
      }],
      responsaveis,
      titulo: novoEventoRequest.titulo,
      tutoria: tutoria,
      textoFormatado: novoEventoRequest.textoFormatado,
      cidadeUnidade: novoEventoRequest.cidadeUnidade ? novoEventoRequest.cidadeUnidade : '',
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
  alteraTipoDeEvento(
      eventoId: string, descricaoTipoEvento: string,
      descricaoSubTipoEvento: string): Observable<fromDocuments.Evento> {
    const evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

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
  findEventosByUsuarioLogado(
      termToFilter?: string,
      page?: number,
      pageSize?: number,
      ): Observable<fromDocuments.EventoPaginado> {
    let eventos: fromDocuments.Evento[] =
        TutoriaUtils.filtraEventos(termToFilter);

    eventos.sort(
        (a, b) => new Date(b.dataRegistro).getTime() -
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

  reabreEvento(eventoId: string, textoComentario?: string):
      Observable<fromDocuments.Evento> {
    const evento: fromDocuments.Evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

    let agora: Date = new Date();
    evento.isResolvido = false;

    if (textoComentario) {
      // COMENTÁRIO, SE EXISTIR
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
    const comentario: fromDocuments.Interacao = {
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

  encerraEvento(eventoId: string, textoComentario: string):
      Observable<fromDocuments.Evento> {
    const evento: fromDocuments.Evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

    let agora: Date = new Date();
    evento.isResolvido = true;

    if (textoComentario) {
      // COMENTÁRIO, SE EXISTIR
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
    const comentario: fromDocuments.Interacao = {
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
  insereComentario(eventoId: string, textoComentario: string):
      Observable<fromDocuments.Evento> {
    if (!textoComentario) {
      return throwError(eventoId);
    }

    const evento: fromDocuments.Evento = EVENTOS_EXISTENTES.find(
        (evt: fromDocuments.Evento) => evt.id === eventoId);

    let agora: Date = new Date();

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
    };

    evento.interacoes.push(comentario);

    return observableOf(JSON.parse(JSON.stringify(evento)));
  }
}

/**
 * ESTA CLASSE PODERÁ SER APAGADA QUANDO FOR PARA O PROJETO, POIS A LÓGICA
 * ABAIXO SERÁ FEITA NO SERVIDOR
 */
class TutoriaUtils {
  static filtraEventos(termToFilter: string): fromDocuments.Evento[] {
    if (!termToFilter) {
      return EVENTOS_EXISTENTES;
    }

    return EVENTOS_EXISTENTES.filter(
        (evt: fromDocuments.Evento) =>
            TutoriaUtils._tutorContem(evt, termToFilter) ||
            TutoriaUtils._responsavelContem(evt, termToFilter) ||
            TutoriaUtils._observacaoContem(evt, termToFilter) ||
            TutoriaUtils._ocorrenciaContem(evt, termToFilter) ||
            TutoriaUtils._comentarioContem(evt, termToFilter),
    );
  }

  private static _observacaoContem(
      evt: fromDocuments.Evento, termToFilter: string): boolean {
    return evt.observacao &&
        evt.observacao.toUpperCase().includes(termToFilter.toUpperCase());
  }

  private static _ocorrenciaContem(
      evt: fromDocuments.Evento, termToFilter: string): boolean {
    return evt.parecer &&
        evt.parecer.toUpperCase().includes(termToFilter.toUpperCase());
  }

  private static _comentarioContem(
      evt: fromDocuments.Evento, termToFilter: string): boolean {
    if (!evt.interacoes || !evt.interacoes.length) {
      return false;
    }

    return evt.interacoes.some((c: fromDocuments.Interacao) => {
      termToFilter = termToFilter.toUpperCase();

      c.historicoInteracoes.sort(
          (a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
      return c.historicoInteracoes[0]
          .texto.semFormatacao.toUpperCase()
          .includes(termToFilter);
    });
  }

  private static _responsavelContem(
      evt: fromDocuments.Evento, termToFilter: string): boolean {
    termToFilter = termToFilter.toUpperCase();

    return evt.responsaveis.some(
        (r) => !!r &&
            (r.email.toUpperCase().includes(termToFilter) ||
             (!!r.nomeResponsavel &&
              r.nomeResponsavel.toUpperCase().includes(termToFilter))),
    );
  }

  private static _tutorContem(evt: fromDocuments.Evento, termToFilter: string):
      boolean {
    if (!evt.tutoria.historicoTutores && !evt.tutoria.historicoTutores.length) {
      return false;
    }

    const tutor = evt.tutoria.historicoTutores.filter((t) => !t.dataFim);

    if (!tutor || !tutor.length) {
      return false;
    }

    termToFilter = termToFilter.toUpperCase();

    return (
        tutor[0].email.toUpperCase().includes(termToFilter) ||
        (!!tutor[0].nomeTutor &&
         tutor[0].nomeTutor.toUpperCase().includes(termToFilter)));
  }
}
