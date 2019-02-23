import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CustomMaterialModule} from '../custom-material.module';

// tslint:disable-next-line:max-line-length
import {ConfirmationDialogComponent} from './dialogs/confirmation-dialog/confirmation-dialog.component';
import {ForceSelectionDirective} from './directives/force-selection/force-selection.directive';
import {MoneyMaskDirective} from './directives/input-masks/money-mask.directive';
import {UppercaseDirective} from './directives/input-uppercase/uppercase.directive';
import {MenuComponent} from './menu/menu.component';
import {NomeSobrenomeAmigavelPipe} from './pipes/nome-sobrenome-amigavel.pipe';
import {SobrenomeAmigavelPipe} from './pipes/sobrenome-amigavel.pipe';
import {TutoriasComTurmasPipe} from './pipes/tutorias-com-turmas.pipe';

@NgModule({
  imports: [CommonModule, RouterModule, CustomMaterialModule],
  declarations: [
    /** components */
    ConfirmationDialogComponent,
    MenuComponent,

    /** directives */
    ForceSelectionDirective,
    MoneyMaskDirective,
    UppercaseDirective,

    /** pipes */
    NomeSobrenomeAmigavelPipe,
    SobrenomeAmigavelPipe,
    TutoriasComTurmasPipe,
  ],
  entryComponents: [ConfirmationDialogComponent],
  exports: [
    CommonModule,
    RouterModule,

    /** components */
    ConfirmationDialogComponent,
    MenuComponent,

    /** directives */
    ForceSelectionDirective,
    MoneyMaskDirective,
    UppercaseDirective,

    /** pipes */
    NomeSobrenomeAmigavelPipe,
    SobrenomeAmigavelPipe,
    TutoriasComTurmasPipe,
  ],
})
export class SharedModule {}
