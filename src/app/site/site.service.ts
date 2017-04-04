import { Injectable, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { Site } from '../model/site-model';

@Injectable()
export class SiteService {

  public get searchItems(): Observable<Site []> {
    return this.siteSubject.asObservable();
  }

  private siteSubject = new Subject<Site []>();

  private searchSubject = new Subject<object>();
  private serverUrl = 'http://localhost:1337/api/v1/article';

  constructor(private http: Http) {
    this.searchSubject
      .startWith({
        limit: 3,
      })
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((params) => {
        console.info('params: ', params);
        return this.querySite(params);
      })
      .subscribe((sites: Site []) => {
        this.siteSubject.next(sites);
      });
  }

  public search(key?: string, limit: number = 3, skip: number = 0) {
    this.searchSubject.next({
      limit,
      search: key,
      skip,
    });
  }

  private querySite(params: Object = {}): Observable<Site []> {
    let queryStr = this.serverUrl + '?';
    queryStr += Object.keys(params)
      .map((key) => {
        return `${key}=${params[key] || ''}`;
      })
      .join('&');

    return this.http
      .get(queryStr)
      .map((r: Response) => {
        return r.json() as Site[];
      });
  }

}
