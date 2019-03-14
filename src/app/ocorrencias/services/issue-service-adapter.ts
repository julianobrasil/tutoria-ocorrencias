import {InjectionToken} from '@angular/core';

import {Observable} from 'rxjs';

import {
  Issue,
  IssueTrackerConfiguration,
  IssueTrackerPagination,
} from '../model';
import {IssueCreateRequest} from '../model/adapters/issue-create-request';

/** Token para injetar o serviço de obtenção de pessoas */
export const ISSUE_SERVICE_ADAPTER: InjectionToken<IssueServiceAdapter> =
    new InjectionToken<IssueServiceAdapter>('ISSUE_SERVICE_ADAPTER');

export interface IssueServiceAdapter {
  /** grab some basic configurations that the issue tracker needs to work */
  getIssueTrackerConfiguration$(): Observable<IssueTrackerConfiguration>;

  /** create a new issue */
  createIssue(newIssueRequest: IssueCreateRequest): void;

  /** get the pagination info */
  getPagination$(): Observable<IssueTrackerPagination>;

  /** get the current issues */
  listIssues$(): Observable<Issue[]>;

  /** get the offset time between client and server */
  getServerTimeOffset$(): Observable<number>;

  /** set the issues array */
  setIssues(issues: Issue[]);

  /** set the current pagination object */
  setPagination(pagination: IssueTrackerPagination);

  /** set the pagination object and update the list of issues */
  setPaginationAndUpdateListOfIssues(pagination?: IssueTrackerPagination);

  /** update list of issues based on a search term */
  listIssuesBySearchTerm(searchTerm: string): void;

  /** build an Issue object from a custom object */
  customObjectToIssueConverter<T>(customObject: T): Issue;

  /** build an Issue object from a custom object */
  issueToCustomObjectConverter<T>(issue: Issue): T;
}
