import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';

import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {SatPopoverAnchor} from '@ncstate/sat-popover';

import {
  OcorrenciaDetalhesComponentService,
} from '../../../ocorrencia-detalhes/ocorrencia-detalhes-component.service';

import {
  HistoricoInteracao,
  ObjectReference,
} from '@model-objects';

interface UsuarioPopoverInfo {
  login: string;
  responsavelRef: ObjectReference;
}

interface PopoverAction {
  anchor: SatPopoverAnchor;
  open: boolean;
}

@Component({
  selector: 'app-ocorrencia-acao-linha-alteracao-responsaveis',
  templateUrl: './ocorrencia-acao-linha-alteracao-responsaveis.component.html',
  styleUrls: ['./ocorrencia-acao-linha-alteracao-responsaveis.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OcorrenciaAcaoLinhaAlteracaoResponsaveisComponent implements
    OnDestroy,
    OnInit {
  /** Historico da interação que contém os usuários adicionados e removidos */
  @Input()
  get historicoInteracao(): HistoricoInteracao {
    return this._historicoInteracao;
  }
  set historicoInteracao(value: HistoricoInteracao) {
    this._historicoInteracao = value;

    this._setupResponsaveis();
  }
  private _historicoInteracao: HistoricoInteracao;

  /** Responsáveis adicionados */
  _responsaveisAdicionados: UsuarioPopoverInfo[];

  /** Responsáveis removidos */
  _responsaveisRemovidos: UsuarioPopoverInfo[];

  /** usuário selecionado quando o usuário passa o mouse por cima */
  _usuarioInfoSelecionado: UsuarioPopoverInfo;

  /** popover anchor selecionado no momento */
  _popoverAnchor: SatPopoverAnchor;

  /** dispara ação apra abrir e fechar o popover */
  _popoverAction$: Subject<PopoverAction> = new Subject<PopoverAction>();

  constructor(@Optional() private _ocorrenciaDetalhesComponentService:
                  OcorrenciaDetalhesComponentService) {}

  ngOnInit() {
    // Isso aqui é necessário para poder abrir e fechar o popover quando o
    // usuário dispara os eventos de mouseenter e mouseleave => ele pode estar
    // entrando na área do próprio popover para poder copiar as informações de
    // usuário que estão sendo mostradas (nome ou e-mail).
    this._popoverAction$.pipe(debounceTime(300))
        .subscribe((action: PopoverAction) => {
          if (action.open) {
            if (this._ocorrenciaDetalhesComponentService) {
              this._ocorrenciaDetalhesComponentService
                  .interrompeAtualizacaoPeriodica(true);
            }
            action.anchor.openPopover();
          } else {
            if (this._ocorrenciaDetalhesComponentService) {
              this._ocorrenciaDetalhesComponentService
                  .interrompeAtualizacaoPeriodica(false);
            }
            action.anchor.closePopover();
          }
        });
  }

  ngOnDestroy() {
    if (this._popoverAction$ && !this._popoverAction$.closed) {
      this._popoverAction$.complete();
    }
  }

  /** Mostra o popover */
  _mostraPopover(userInfo: UsuarioPopoverInfo, anchor: SatPopoverAnchor) {
    if (this._popoverAnchor && this._usuarioInfoSelecionado &&
        this._usuarioInfoSelecionado.login !== userInfo.login) {
      this._popoverAnchor.closePopover();
    }

    this._usuarioInfoSelecionado = userInfo;
    this._popoverAnchor = anchor;

    this._popoverAction$.next({anchor, open: true});
  }

  /** Esconde o popover */
  _escondePopover(anchor?: SatPopoverAnchor) {
    if (anchor) {
      this._popoverAction$.next({anchor, open: false});
    } else if (this._popoverAnchor) {
      this._popoverAction$.next({anchor: this._popoverAnchor, open: false});
    }
  }

  /** Mantém popover aberto quando o usuário entra na área do popover */
  _mantemPopoverAberto() {
    this._popoverAction$.next({anchor: this._popoverAnchor, open: true});
  }

  /**
   * São classes para garantir o espaçamento entre nomes, conjunção "E" e
   * vírgula entre os logins dos usuários
   */
  _getConectivoClass(isConectivoAnd: boolean) {
    return {
      'margem-dupla': isConectivoAnd,
      'margem-direita': !isConectivoAnd,
    };
  }

  /** Inicializa os responsáveis */
  private _setupResponsaveis() {
    // Trata os responsáveis adicionados...
    const responsaveisAdicionados: ObjectReference[] =
        this._historicoInteracao && this._historicoInteracao.auditoriaAcao &&
                this._historicoInteracao.auditoriaAcao.valorCorrente ?
            JSON.parse(this._historicoInteracao.auditoriaAcao.valorCorrente) :
            [];

    this._responsaveisAdicionados =
        responsaveisAdicionados.map((responsavelRef: ObjectReference) => ({
                                      login: responsavelRef.code.split('@')[0],
                                      responsavelRef,
                                    }))
            .sort((a: UsuarioPopoverInfo, b: UsuarioPopoverInfo) =>
                      a.login.localeCompare(b.login, 'pt-br',
                                            {sensitivity: 'base'}));
    // Trata os responsáveis removidos...
    const responsaveisRemovidos: ObjectReference[] =
        this._historicoInteracao && this._historicoInteracao.auditoriaAcao &&
                this._historicoInteracao.auditoriaAcao.valorAntigo ?
            JSON.parse(this._historicoInteracao.auditoriaAcao.valorAntigo) :
            [];

    this._responsaveisRemovidos =
        responsaveisRemovidos.map((responsavelRef: ObjectReference) => ({
                                    login: responsavelRef.code.split('@')[0],
                                    responsavelRef,
                                  }))
            .sort((a: UsuarioPopoverInfo, b: UsuarioPopoverInfo) =>
                      a.login.localeCompare(b.login, 'pt-br',
                                            {sensitivity: 'base'}));
  }
}
