/* tslint:disable:no-unused-variable */

import {async, inject, TestBed} from '@angular/core/testing';
import {GeradorIdService} from './gerador-id.service';

describe('GeradorIdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GeradorIdService],
    });
  });

  it(
    'should ...',
    inject([GeradorIdService], (service: GeradorIdService) => {
      expect(service).toBeTruthy();
    }),
  );
});
