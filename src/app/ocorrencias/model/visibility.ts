import {VisibilityType} from './enumerations/visibility-type';
import {ObjectReference} from './object-reference';

export interface Visibility {
  tipo: VisibilityType;
  userRefs?: ObjectReference[];
}
