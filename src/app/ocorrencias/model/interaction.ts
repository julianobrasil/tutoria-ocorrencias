import {InteractionType} from './enumerations/interaction-type';
import {InteractionHistory} from './interaction-history';
import {ObjectReference} from './object-reference';
import {Visibility} from './visibility';

export interface Role {
  icon?: string;
  description: string;
}

export interface Interaction {
  /** Every action has a generated id (unique in the issue scope) */
  id: string;

  /** Can be a comment or an action */
  type: InteractionType;

  authorRef: ObjectReference;

  creationDate: Date | string;

  role: Role;

  visibility?: Visibility;

  interactionHistory: InteractionHistory[];
}
