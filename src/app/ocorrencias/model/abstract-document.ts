export abstract class AbstractDocument {
  id?: string;
  version?: number;
  creationDate?: Date | any;
  createdBy?: string;
  lasModifiedDate?: Date | any;
  lasModifiedBy?: string;
}
