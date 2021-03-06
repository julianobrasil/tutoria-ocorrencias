import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MatDatepicker, MatOptionSelectionChange} from '@angular/material';
import {ActivatedRoute, Router, UrlSegment} from '@angular/router';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {SatPopover} from '@ncstate/sat-popover';
import {BehaviorSubject, combineLatest, Observable, Subject} from 'rxjs';
import {debounceTime, filter, first, map, startWith, takeUntil, tap} from 'rxjs/operators';

import {RouterExtraService} from '../../shared/services/router-extra';

import {
  OcorrenciaDadosDaGravacao,
  OcorrenciaStatusGravacaoService,
} from '../ocorrencia-status-gravacao.service';

import {
  OcorrenciaFormularioComponentData,
  OcorrenciaFormularioComponentService,
  OcorrenciaFormularioComponentTipo,
} from './ocorrencia-formulario-component.service';

import {Evento, SubTipoEvento, TipoEvento, TipoVisibilidade, Unidade} from '@model-objects';
import {TutoriaNome} from '../../model/helper-objects/telas/tutoria-helper';

import {enterFormAnimation} from '../animations';

@Component({
  selector: 'app-ocorrencia-formulario',
  templateUrl: './ocorrencia-formulario.component.html',
  styleUrls: ['./ocorrencia-formulario.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  animations: [enterFormAnimation],
})
export class OcorrenciaFormularioComponent implements AfterViewInit, OnDestroy {
  _form: FormGroup = new FormGroup({titulo: new FormControl()});

  private _disabled = false;
  @Input()
  get disabled(): boolean {
    return this._disabled;
  }
  set disabled(disabled: boolean) {
    this._disabled = disabled;

    if (disabled) {
      this._form.disable();
    } else {
      this._form.enable();
    }
  }

  /** tipo de formulário (Tutoria ou Ocorrência Comum) */
  _tipoFormulario$: Subject<OcorrenciaFormularioComponentTipo> = new Subject<
    OcorrenciaFormularioComponentTipo
  >();
  _tiposFormularioDisponiveis = OcorrenciaFormularioComponentTipo;
  private _tipoFormulario: OcorrenciaFormularioComponentTipo =
    OcorrenciaFormularioComponentTipo.TUTORIA;
  @Input()
  get tipoFormulario(): OcorrenciaFormularioComponentTipo {
    return this._tipoFormulario;
  }
  set tipoFormulario(tf: OcorrenciaFormularioComponentTipo) {
    this._tipoFormulario = tf;

    this._tipoFormulario$.next(tf);
  }

  /** quando uma ocorrência está sendo editada */
  private _ocorrencia$: BehaviorSubject<Evento> = new BehaviorSubject<Evento>(null);
  private _ocorrencia: Evento = null;
  @Input()
  get ocorrencia(): Evento {
    return this._ocorrencia;
  }
  set ocorrencia(ocorrencia: Evento) {
    this._ocorrencia = ocorrencia
      ? Object.assign(new Evento(), {...JSON.parse(JSON.stringify(ocorrencia))})
      : ocorrencia;

    if (!ocorrencia) {
      this._form.reset();
      return;
    }

    this._ocorrencia$.next(ocorrencia);
  }

  /** diferença de hor no servidor em millisegundos */
  private _differencaDeHoraNoServidor$: Subject<number> = new Subject<number>();
  private _differencaDeHoraNoServidor: number;
  @Input()
  get differencaDeHoraNoServidor(): number {
    return this._differencaDeHoraNoServidor;
  }
  set differencaDeHoraNoServidor(d: number) {
    this._differencaDeHoraNoServidor = d;

    this._differencaDeHoraNoServidor$.next(d);
  }

  /** unidades disponíveis */
  @Input() unidades: Unidade[];

  /** emite quando a ocorrência precisa ser gravada */
  @Output()
  dadosDoFormularioParaGravar: EventEmitter<OcorrenciaFormularioComponentData> = new EventEmitter<
    OcorrenciaFormularioComponentData
  >();

  /** emite quando o botão de cancelar é clicado */
  @Output()
  cancelamentoSolicitado: EventEmitter<void> = new EventEmitter<void>();

  /** MatDatepicker */
  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;

  /**
   * depois que a data é selecionada este componente é focado (ou o datepicker
   * abrirá novamente)
   */
  @ViewChild('elementToFocusAfterDate') _elementToFocusAfterDate: ElementRef;

  _startDate: Date;
  _dataDeHoje: Date;

  /** se for criado um evento, a data dele ficará aqui */
  _dataEvento: Date;

  /** tipos de eventos disponíveis */
  _tiposDisponiveis$: Observable<TipoEvento[]> = this._componentService.getTiposDisponiveis$();

  /** nomes das tutorias para aparecer no mat-select */
  _tutoriasNomes$: Observable<TutoriaNome[]> = this._componentService.getTutoriasNomes$();

  /** true quando existe uma ocorrência carregada para ser editada */
  _isEditando = false;

  /** true quando qualquer acesso ao banco está sendo feito */
  _isAcessandoBanco = false;

  /** datepicker está desabilitado */
  _datepickerDisabled = false;

  /** sincronismo de horário com servidor disponível */
  _timeFromServerIsAvailable = false;

  /** CkEditor */
  _editor = ClassicEditor;

  /**
   * Botões da toolbar:
   *
   * POSSIBILIDADES: [
   *   '|', 'undo', 'redo', 'bold', 'italic', 'blockQuote', 'ckfinder',
   *   'imageTextAlternative', 'imageUpload', 'heading', 'imageStyle:full',
   *   'imageStyle:side', 'link', 'numberedList', 'bulletedList', 'mediaEmbed',
   *   'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells'
   * ]
   */
  _botoesDaToolbar: string[] = [
    'heading',
    '|',
    'bold',
    'italic',
    'numberedList',
    'bulletedList',
    'insertTable',
  ];

  /** configurações do CkEditor */
  _config: {[key: string]: string | string[]} = {
    language: 'pt-br',
    toolbar: this._botoesDaToolbar,
  };

  /** destrói todas as assinaturas em observables */
  private _destroy$: Subject<void> = new Subject<void>();

  constructor(
    private _cd: ChangeDetectorRef,
    private _componentService: OcorrenciaFormularioComponentService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _routerExtra: RouterExtraService,
    private _statusGravacaoService: OcorrenciaStatusGravacaoService,
  ) {
    this._initGeral();

    this._observaStatusGravacao();
  }

  ngAfterViewInit() {
    if (this.datepicker) {
      this.datepicker.closedStream.subscribe(() => {
        this._datepickerDisabled = true;
        setTimeout(() => {
          this._elementToFocusAfterDate.nativeElement.focus();
        }, 500);

        setTimeout(() => {
          this._datepickerDisabled = false;
        }, 800);
      });
    }
  }

  ngOnDestroy() {
    if (this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }

    if (this._tipoFormulario$ && !this._tipoFormulario$.closed) {
      this._tipoFormulario$.complete();
    }
  }

  /** edição/criação cancelada */
  _cancelarEdicao() {
    this.ocorrencia = null;
    if (
      this._routerExtra.getUrlAnterior() === '/' ||
      this._routerExtra.getUrlAnterior() === '/ocorrencia'
    ) {
      this.cancelamentoSolicitado.emit();

      this._router.navigate(['../../../']);
    } else {
      const id = this._routerExtra
        .getUrlAnterior()
        .substr(this._routerExtra.getUrlAnterior().lastIndexOf('/') + 1);
      this._router.navigate(['../../', id], {relativeTo: this._route});
    }
  }

  /** emite dados para criar/gravar ocorrência */
  _gravarOcorrencia() {
    // se estiver editando, existirá um objeto this._ocorrencia e o id deve ser
    // colocado no formulário
    const formData: OcorrenciaFormularioComponentData = this._ocorrencia
      ? {...this._form.value, id: this._ocorrencia.id}
      : {...this._form.value};

    formData.visibilidade =
      this.tipoFormulario === OcorrenciaFormularioComponentTipo.TUTORIA
        ? {
            tipo: TipoVisibilidade.SOMENTE_PARTICIPANTES,
          }
        : {
            tipo: TipoVisibilidade.TODOS,
          };

    this.dadosDoFormularioParaGravar.emit(formData);
  }

  /** fecha o popover quando o painel se fecha */
  _closeOpenedPopovers(isOpened: boolean, popover: SatPopover) {
    if (!isOpened && popover && popover.isOpen()) {
      popover.close();
    }
  }

  /** abre o datepicker quando é focado, caso já não esteja aberto */
  _openDatepickerFocus(picker: MatDatepicker<any>) {
    if (!picker.opened && !this._datepickerDisabled) {
      picker.open();
    }
  }

  /** abre o datepicker quando ele é clicado */
  _openDatepickerClick(picker: MatDatepicker<any>) {
    this._datepickerDisabled = false;
    picker.open();
  }

  /** limpa o controle de unidade quando o usuário seleciona "NENHUMA" */
  _trataOpcaoNenhuma(selection: MatOptionSelectionChange) {
    if (!selection.source.value) {
      this._form.get('unidade').setValue(null);
    }
  }

  /** mostra título... somente se conseguir pegar a hora do servidor */
  get _tituloVisible(): boolean {
    return !!this._differencaDeHoraNoServidor;
  }

  /** mostra tutoria ou unidade na template */
  get _turmaDeTutoriaOuUnidadeVisible(): boolean {
    const tituloValidoEIntocado: boolean =
      this._form.get('titulo') && this._form.get('titulo').valid;
    const tutoriaPossuiValor = !!this._form.get('tutoria') && !!this._form.get('tutoria').value;
    const unidadePossuiValor = !!this._form.get('unidade') && !!this._form.get('unidade').value;
    const tipoEventoPossuiValor =
      !!this._form.get('tipoEvento') && !!this._form.get('tipoEvento').value;
    return (
      tituloValidoEIntocado || tutoriaPossuiValor || unidadePossuiValor || tipoEventoPossuiValor
    );
  }

  /** mostra o select de tipo de evento */
  get _tipoVisible(): boolean {
    switch (this._tipoFormulario) {
      case OcorrenciaFormularioComponentTipo.TUTORIA: {
        return (
          this._turmaDeTutoriaOuUnidadeVisible &&
          this._form.get('tutoria') &&
          this._form.get('tutoria').valid
        );
      }

      case OcorrenciaFormularioComponentTipo.OCORRENCIA_COMUM: {
        return (
          this._turmaDeTutoriaOuUnidadeVisible &&
          this._form.get('unidade') &&
          this._form.get('unidade').valid
        );
      }
    }
    return false;
  }

  /** mostra o select de tipo de evento */
  get _subTipoVisible(): boolean {
    return this._tipoVisible && this._form.get('tipoEvento') && this._form.get('tipoEvento').valid;
  }

  get _dataVisible(): boolean {
    return (
      this._subTipoVisible &&
      this._form.get('subTipoEvento') &&
      this._form.get('subTipoEvento').valid
    );
  }

  get _parecerVisible(): boolean {
    return this._dataVisible && this._form.get('dataEvento') && this._form.get('dataEvento').valid;
  }

  get _parecerValidoEVisivel(): boolean {
    return this._parecerVisible && this._form.get('parecer') && this._form.get('parecer').valid;
  }

  /** desabilita o botão de gravar */
  get _disableSaveButton(): boolean {
    const maxCaracteresUltrapassadoParecer =
      this._form.value.parecer && this._form.value.parecer.length > 3000;
    const maxCaracteresUltrapassadoObservacao =
      this._form.value.observacao && this._form.value.observacao.length > 3000;
    return (
      !this._form.valid || maxCaracteresUltrapassadoObservacao || maxCaracteresUltrapassadoParecer
    );
  }

  /** inicialização geral do sistema */
  private _initGeral() {
    combineLatest(
      this._tipoFormulario$.pipe(
        startWith(this._tipoFormulario),
        debounceTime(500),
        filter(Boolean),
      ),
      this._differencaDeHoraNoServidor$.pipe(
        debounceTime(500),
        filter((value: number) => value !== null && value !== undefined),
      ),
      this._ocorrencia$.pipe(
        startWith(null),
        debounceTime(500),
      ),
    )
      .pipe(takeUntil(this._destroy$))
      .subscribe(([tipoFormulario, diferencaDehoraNoServidor, ocorrencia]) => {
        // constrói formulario...
        this._setupFormulario(tipoFormulario);

        // ajusta calendário...
        this._ajustaDataEHoraLocalmente(diferencaDehoraNoServidor);

        // se houver uma ocorrência para ser carregada, coloca no
        // formulário...
        if (ocorrencia) {
          this._setupFormValues();
        }
      });
  }

  /** configura valores do formulário */
  private _setupFormValues(): void {
    combineLatest(this._componentService.getTiposDisponiveis$())
      .pipe(
        first(),
        map(([values]) => values),
        map(
          (values: TipoEvento[]) =>
            values.filter(
              (value: TipoEvento) => value.descricao === this._ocorrencia.descricaoTipoEvento,
            )[0],
        ),
        tap((tipoEvento: TipoEvento) => {
          const subTipoEvento = tipoEvento.listaSubTipoEvento.filter(
            (value: SubTipoEvento) => value.descricao === this._ocorrencia.descricaoSubTipoEvento,
          )[0];

          this._form.patchValue({
            tutoria: this._ocorrencia.tutoria,
            tipoEvento,
            subTipoEvento,
            dataEvento: new Date(this._ocorrencia.data),
            parecer: this._ocorrencia.parecer,
            local: this._ocorrencia.local,
            isResolvido: this._ocorrencia.isEncerrado,
          });
        }),
      )
      .subscribe();
  }

  /**
   * Ajusta a data e a hora deste componente
   *
   * @private
   * @param {number} diffHoraLocalServidorMilliSeconds
   * @returns
   * @memberof OcorrenciaFormularioComponent
   */
  private _ajustaDataEHoraLocalmente(diffHoraLocalServidorMilliSeconds: number) {
    this._timeFromServerIsAvailable =
      diffHoraLocalServidorMilliSeconds !== null && diffHoraLocalServidorMilliSeconds !== undefined;

    if (!this._timeFromServerIsAvailable) {
      this._form.disable();
      return;
    }

    this._dataEvento = new Date(new Date().getTime() - diffHoraLocalServidorMilliSeconds);
    this._dataDeHoje = new Date(new Date().getTime() - diffHoraLocalServidorMilliSeconds);

    this._form.enable();
  }

  /**
   * Cria o formulário conforme o título de formulári passado (default =>
   * TUTORIA)
   *
   * @private
   * @param {OcorrenciaFormularioComponentTipo} tf
   * @memberof OcorrenciaFormularioComponent
   */
  private _setupFormulario(tf: OcorrenciaFormularioComponentTipo) {
    this._form = this._fb.group({
      titulo: [null, Validators.required],
      unidade: null,
      tutoria:
        tf === OcorrenciaFormularioComponentTipo.TUTORIA ? [null, Validators.required] : null,
      tipoEvento: [null, Validators.required],
      subTipoEvento: [null, Validators.required],
      dataEvento: [null, Validators.required],
      parecer: [null, Validators.required],
      local: null,
      isResolvido: [null, Validators.required],
    });

    // isso é feito porque quando o valor digitado no ckeditor é alterado, não
    // está disparando a atualização no _form
    this._form
      .get('parecer')
      .valueChanges.pipe(
        debounceTime(300),
        takeUntil(this._destroy$),
      )
      .subscribe((_) => this._cd.markForCheck());

    this._cd.markForCheck();
  }

  /** toma providências conforme o final da gravação */
  private _observaStatusGravacao() {
    this._statusGravacaoService
      .getStatusCriacaoDeEvento$()
      .subscribe((status: OcorrenciaDadosDaGravacao) => {
        if (status.sucesso) {
          combineLatest(this._route.url)
            .pipe(
              first(),
              map((value: [UrlSegment[]]) => value[0]),
            )
            .subscribe((values: UrlSegment[]) => {
              if (values.some((v: UrlSegment) => v.path === 'nova-ocorrencia')) {
                this._router.navigate(['../../', status.evento.id], {relativeTo: this._route});
              } else {
                this._router.navigate(['./', status.evento.id], {relativeTo: this._route});
              }
            });
        }
      });
  }
}
