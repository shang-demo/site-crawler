import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { CrawlerRule } from '../model/crawler-rule-model';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Site } from '../model/site-model';

@Injectable()
export class CrawlerRuleService {
  public LOCALE_RULES: CrawlerRule[];

  private serverUrl = 'SERVER_URL';

  constructor(private http: Http,
              private slimLoader: SlimLoadingBarService) {
    try {
      this.LOCALE_RULES = JSON.parse(localStorage.getItem('localRules')) || [];
    } catch (e) {
      console.warn(e);
      this.LOCALE_RULES = [];
    }
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

  public preview(body: object): Observable<Site[]> {
    let url = this.serverUrl + '/api/v1/crawler-rule/preview';
    this.slimLoader.start();
    return this.http
      .post(url, body)
      .map((r: Response) => {
        this.slimLoader.complete();
        return r.json() as Site[];
      });
  }

  public remove(id: string): Observable<object> {
    let url = this.serverUrl + '/api/v1/crawler-rule/' + id;
    this.slimLoader.start();
    return this.http
      .delete(url)
      .map((r: Response) => {
        this.slimLoader.complete();
        return r.json() as object;
      });
  }

  public importRuleList(body: object): Observable<object> {
    let url = this.serverUrl + '/api/v1/crawler-rule/import';
    this.slimLoader.start();
    return this.http
      .post(url, body)
      .map((r: Response) => {
        this.slimLoader.complete();
        return r.json() as object;
      });
  }

  public mergeRules(remoteRules, localRules) {
    let remoteSites = remoteRules.map((item) => {
      return item.site;
    });

    let localSites = localRules.map((item) => {
      return item.site;
    });

    let deletedSites = this.difference(localSites, remoteSites);
    let newSites = this.difference(remoteSites, localSites);

    deletedSites.forEach((siteName) => {
      let index = localRules.findIndex((item) => {
        return item.site === siteName;
      });

      localRules.splice(index, 1);
    });

    newSites.forEach((siteName) => {
      let index = remoteRules.findIndex((item) => {
        return item.site === siteName;
      });

      localRules.push(remoteRules[index]);
    });

    if (deletedSites.length || newSites.length) {
      console.info('sites change');
      let temp = localRules.map((item) => {
        return {
          site: item.site,
          isShowArticle: item.isShowArticle,
        };
      });

      this.saveRules(temp);
    }
  }

  public saveRules(rules?: CrawlerRule[]) {
    if (rules) {
      this.LOCALE_RULES.length = 0;

      rules.forEach((item) => {
        this.LOCALE_RULES.push(item);
      });
    }

    localStorage.setItem('localRules', JSON.stringify(this.LOCALE_RULES));
  }

  private difference(arr1, arr2) {
    return arr1.filter((i) => {
      return arr2.indexOf(i) < 0;
    });
  };
}
