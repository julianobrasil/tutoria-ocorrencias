import {ObjectReference} from './object-reference';

import {IssueMembershipType} from './enumerations/issue-membership-type';

/**
 * Issue participant information
 *
 * @export
 * @interface IssueMember
 */
export interface IssueMember {
  types: IssueMembershipType[];
  userRef: ObjectReference;
}
