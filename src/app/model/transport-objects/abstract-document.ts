export class AbstractDocument {
  id?: string;
  version?: number;
  creationDate?: Date | any;
  createdBy?: string;
  lasModifiedDate?: Date | any;
  lasModifiedBy?: string;
  _class?: string;

  constructor() {
    this.version = 0;
  }
}
AbstractDocument['__class'] = 'AbstractDocument';
