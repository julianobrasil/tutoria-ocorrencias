import {AbstractDocument} from './abstract-document';
import {FormattedText} from './formatted-text';
import {Interaction} from './interaction';
import {IssueMember} from './IssueMember';
import {ObjectReference} from './object-reference';
import {Visibility} from './visibility';

export class Issue extends AbstractDocument {
  /** When this issue was created */
  issueCreationDate: Date | string = new Date();

  /** Who created this issue */
  author?: ObjectReference;

  /** Wether the issue is closed or not */
  isClosed = false;

  /** Who is responsible to take actions to this issue */
  assignedTo: ObjectReference[];

  /** issue title */
  title?: string;

  /** Formatted text that describes the subject of the issue  */
  formattedIssueText?: FormattedText;

  /**
   * May contain any information about the issue that any possible custom
   * implementations demands.
   */
  targetOject: any;

  /**
   * Target object type is an string that identifies the kind of object is
   * stored on
   * targetObject. It's also for usage in custom implementations.
   */
  targetObjectType: '';

  /** can be a comment or an action */
  interactions?: Interaction[];

  /** involved people (author, commenters, and others) */
  members?: IssueMember[];

  /** who can view this issue */
  visibility?: Visibility;
}
