import {
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  OnDestroy
} from '@angular/core';

import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {IssueTrackerConfiguration, NewIssueActionButtonData} from '../model';

/** Token para injetar o serviço de obtenção de pessoas */
export const NEW_ISSUE_SELECTION_BUTTON_DATA:
    InjectionToken<NewIssueActionButtonData[]> =
        new InjectionToken<NewIssueActionButtonData[]>(
            'List of new issue creation buttons');

@Injectable({
  providedIn: 'root',
})
export class IssueTrackerConfigurationService implements OnDestroy {
  private _configuration: IssueTrackerConfiguration =
      new IssueTrackerConfiguration();

  private _configuration$: BehaviorSubject<IssueTrackerConfiguration> =
      new BehaviorSubject<IssueTrackerConfiguration>(null);

  constructor(@Optional() @Inject(NEW_ISSUE_SELECTION_BUTTON_DATA)
              private _buttonsData: NewIssueActionButtonData[]) {
    this._setupNewIssueButtonsData();

    this._configuration$.next(this._configuration);
  }

  ngOnDestroy(): void {
    if (this._configuration$ && !this._configuration$.closed) {
      this._configuration$.complete();
    }
  }

  /** Grab issue tracker configuration data */
  getNewIssueButtonsData$(): Observable<NewIssueActionButtonData[]> {
    return this._configuration$.pipe(
        map((config: IssueTrackerConfiguration) => config.actionButtons));
  }

  /** Setup which buttons should be shown to create a new issue */
  private _setupNewIssueButtonsData() {
    if (!this._buttonsData) {
      return;
    }

    this._buttonsData.forEach(
        (b: NewIssueActionButtonData) =>
            this._configuration.addNewIssueActionButton(b));
  }
}
