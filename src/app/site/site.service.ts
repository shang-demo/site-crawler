import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, Subject } from 'rxjs';
import { Site } from '../model/site-model';

@Injectable()
export class SiteService {

  public get searchItems(): Observable<Site []> {
    return this.siteSubject.asObservable();
  }

  private meta = {
    page: 1,
    limit: 10,
    search: '',
  };

  private siteSubject = new Subject<Site []>();
  private searchSubject = new Subject<string>();
  private serverUrl = 'http://site-crawler.leanapp.cn';

  constructor(private http: Http) {
    this.searchSubject
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(() => {
        return this.querySite(this.meta);
      })
      .subscribe((sites: Site []) => {
        if (this.meta.page === 1) {
          this.siteSubject.next(null);
        }

        this.siteSubject.next(sites);

        if (sites && sites.length) {
          this.meta.page = this.meta.page + 1;
        }
      });
  }

  public search(key?: string, limit: number = this.meta.limit) {
    this.meta.search = key;
    this.meta.limit = limit;
    // 调用搜索, page 一定为1
    this.meta.page = 1;

    this.searchSubject.next(this.meta.page + this.meta.search);
  }

  public scrollDown(isForce?: boolean) {
    console.info('scrollDown called', this.meta);
    let key = this.meta.page + this.meta.search;
    if (isForce) {
      this.meta.page = 1;
      key += new Date().getTime();
    }
    this.searchSubject.next(key);
  }

  public getSiteUpdateTime() {
    return this.http
      .get(this.serverUrl + '/api/v1/record/update-time')
      .map((r: Response) => {
        return r.json();
      });
  }

  public forceUpdate() {
    return this.http
      .get(this.serverUrl + '/api/v1/task/update-site')
      .map((r: Response) => {
        return r.json();
      });
  }

  private querySite(params: object = {}): Observable<Site []> {
    let queryStr = this.serverUrl + '/api/v1/article?';
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
