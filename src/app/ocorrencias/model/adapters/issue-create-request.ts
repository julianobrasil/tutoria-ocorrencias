
import {FormattedText} from '../formatted-text';
import {Visibility} from '../visibility';

export class IssueCreateRequest {
  /** custom object information */
  targetObject: any;

  /** string representing the type of the target object */
  targetObjectType: string;

  /** Title of the issue */
  issueTitle: '';

  formattedText: FormattedText;

  isClosed: boolean;

  visibility?: Visibility;
}
