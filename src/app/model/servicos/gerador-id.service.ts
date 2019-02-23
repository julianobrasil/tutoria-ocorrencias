import {Injectable} from '@angular/core';

@Injectable()
export class GeradorIdService {
  private static nextId = 1;

  constructor() {}

  getNextId(): number {
    return ++GeradorIdService.nextId;
  }
}
