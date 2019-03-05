import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OcorrenciaPopoverDeEscolhaComponent } from './ocorrencia-popover-de-escolha.component';

describe('OcorrenciaPopoverDeEscolhaComponent', () => {
  let component: OcorrenciaPopoverDeEscolhaComponent;
  let fixture: ComponentFixture<OcorrenciaPopoverDeEscolhaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OcorrenciaPopoverDeEscolhaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OcorrenciaPopoverDeEscolhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
