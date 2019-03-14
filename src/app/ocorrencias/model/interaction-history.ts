import {ActionHistoryAuditing} from './action-history-auditing';

import {ActionType} from './enumerations/action-type';
import {FormattedText} from './formatted-text';

/**
 * Records all changes occured in an interaction object
 *
 * @export
 * @interface InteractionHistory
 */
export interface InteractionHistory {
  date: Date | string;

  text?: FormattedText;

  actionType?: ActionType;

  /** not every action has auditing information */
  actionHistoryAuditing?: ActionHistoryAuditing;
}
