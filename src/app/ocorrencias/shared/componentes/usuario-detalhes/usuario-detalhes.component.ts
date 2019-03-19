import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';

import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

import {SatPopoverAnchor} from '@ncstate/sat-popover';

import {
  OcorrenciaDetalhesComponentService,
} from '../../../ocorrencia-detalhes/ocorrencia-detalhes-component.service';

import {ObjectReference} from '@model-objects';

interface UsuarioPopoverInfo {
  login: string;
  usuarioRef: ObjectReference;
}

interface PopoverAction {
  anchor: SatPopoverAnchor;
  open: boolean;
}

@Component({
  selector: 'app-usuario-detalhes',
  templateUrl: './usuario-detalhes.component.html',
  styleUrls: ['./usuario-detalhes.component.scss'],
})
export class UsuarioDetalhesComponent implements OnDestroy,
    OnInit {
  /** Usuário a ser mostrado */
  @Input()
  get usuarioRef(): ObjectReference {
    return this._usuarioRef;
  }
  set usuarioRef(usuarioRef: ObjectReference) {
    this._usuarioRef = usuarioRef;

    this._usuarioPopoverInfo =
        usuarioRef ?
            {
              login: usuarioRef && usuarioRef.code ?
                         usuarioRef.code.split('@')[0] :
                         '',
              usuarioRef: {
                code: usuarioRef.code,
                description: usuarioRef.code === usuarioRef.description ?
                                 '-' :
                                 usuarioRef.description,
              },
            } :
            null;
  }
  private _usuarioRef: ObjectReference;

  /** Se o objeto contendo o login será o nome, o login ou o e-mail */
  @Input() link: 'nome' | 'login' | 'e-mail' = 'login';

  /** popover anchor selecionado no momento */
  @ViewChild(SatPopoverAnchor) _popoverAnchor: SatPopoverAnchor;

  /** usuário selecionado quando o usuário passa o mouse por cima */
  _usuarioPopoverInfo: UsuarioPopoverInfo;

  /** dispara ação apra abrir e fechar o popover */
  _popoverAction$: Subject<boolean> = new Subject<boolean>();

  constructor(@Optional() private _ocorrenciaDetalhesComponentService:
                  OcorrenciaDetalhesComponentService) {}

  ngOnInit() {
    // Isso aqui é necessário para poder abrir e fechar o popover quando o
    // usuário dispara os eventos de mouseenter e mouseleave => ele pode estar
    // entrando na área do próprio popover para poder copiar as informações de
    // usuário que estão sendo mostradas (nome ou e-mail).
    this._popoverAction$.pipe(debounceTime(300))
        .subscribe((openPopover: boolean) => {
          if (openPopover) {
            if (this._ocorrenciaDetalhesComponentService) {
              this._ocorrenciaDetalhesComponentService
                  .interrompeAtualizacaoPeriodica(true);
            }
            this._popoverAnchor.openPopover();
          } else {
            if (this._ocorrenciaDetalhesComponentService) {
              this._ocorrenciaDetalhesComponentService
                  .interrompeAtualizacaoPeriodica(false);
            }
            this._popoverAnchor.closePopover();
          }
        });
  }

  ngOnDestroy() {
    if (this._popoverAction$ && !this._popoverAction$.closed) {
      this._popoverAction$.complete();
    }
  }
}
