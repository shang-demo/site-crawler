import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { CrawlerRule } from '../model/crawler-rule-model';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Injectable()
export class CrawlerRuleService {
  private serverUrl = 'SERVER_URL';

  constructor(private http: Http,
              private slimLoader: SlimLoadingBarService) {

  }

  public query(params: object = {}): Observable<CrawlerRule []> {
    let queryStr = this.serverUrl + '/api/v1/crawler-rule?';
    queryStr += Object.keys(params)
      .map((key) => {
        return `${key}=${params[key] || ''}`;
      })
      .join('&');

    this.slimLoader.start();
    return this.http
      .get(queryStr)
      .map((r: Response) => {
        this.slimLoader.complete();
        return r.json() as CrawlerRule[];
      });
  }

  public get(id: string): Observable<CrawlerRule> {
    let url = this.serverUrl + '/api/v1/crawler-rule/' + id;
    this.slimLoader.start();
    return this.http
      .get(url)
      .map((r: Response) => {
        this.slimLoader.complete();
        return r.json() as CrawlerRule;
      });
  }

  public save(body: object): Observable<CrawlerRule> {
    let url = this.serverUrl + '/api/v1/crawler-rule';
    this.slimLoader.start();
    return this.http
      .post(url, body)
      .map((r: Response) => {
        this.slimLoader.complete();
        return r.json() as CrawlerRule;
      });
  }
}
