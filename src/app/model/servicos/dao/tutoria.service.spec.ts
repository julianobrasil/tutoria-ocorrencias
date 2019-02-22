/* tslint:disable:no-unused-variable */

import {async, inject, TestBed} from '@angular/core/testing';
import {TutoriaService} from './tutoria.service';

describe('TutoriaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TutoriaService],
    });
  });

  it(
    'should ...',
    inject([TutoriaService], (service: TutoriaService) => {
      expect(service).toBeTruthy();
    }),
  );
});
