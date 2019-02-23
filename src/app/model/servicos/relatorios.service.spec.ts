import {inject, TestBed} from '@angular/core/testing';

import {RelatoriosService} from './relatorios.service';

describe('RelatoriosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelatoriosService],
    });
  });

  it(
    'should ...',
    inject([RelatoriosService], (service: RelatoriosService) => {
      expect(service).toBeTruthy();
    }),
  );
});
