import {Component, Input} from '@angular/core';

export enum AvatarSize {
  MINI = 'mini',
  REGULAR = 'regular',
  SMALL = 'small',
}

@Component({
  selector: 'app-ocorrencia-avatar',
  templateUrl: './ocorrencia-avatar.component.html',
  styleUrls: ['./ocorrencia-avatar.component.scss'],
})
export class OcorrenciaAvatarComponent {
  /** label a ser mostrado */
  @Input() label: string;

  /** nome ou email da pessoa */
  @Input() identificacaoTooltip: string;

  /** cor de fundo do avatar */
  @Input() corDoAvatar: string;

  /** true se a fonte do avatar for branca */
  @Input() isTextoDoAvatarBranco = false;

  /** avatar pequeno */
  @Input() size: AvatarSize = AvatarSize.REGULAR;

  get _classesDoContainer(): {[key: string]: boolean} {
    return {
      small: this.size === AvatarSize.SMALL,
      mini: this.size === 'mini',
    };
  }
}
