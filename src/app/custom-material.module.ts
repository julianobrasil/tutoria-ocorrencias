import {LOCALE_ID, NgModule} from '@angular/core';

import {registerLocaleData} from '@angular/common';

import localePTBR from '@angular/common/locales/pt';
registerLocaleData(localePTBR);

import {FlexLayoutModule} from '@angular/flex-layout';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  NativeDateAdapter,
} from '@angular/material';
import {SatPopoverModule} from '@ncstate/sat-popover';
import {CustomDateAdapter} from './core/date-time/custom-date-adapter';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    FlexLayoutModule,
    SatPopoverModule,
  ],
  providers: [
    {provide: DateAdapter, useClass: CustomDateAdapter},
    {provide: LOCALE_ID, useValue: 'pt'},
    {provide: MAT_DATE_LOCALE, useValue: 'pt'},
  ],
})
export class CustomMaterialModule {
  constructor() {}
}
