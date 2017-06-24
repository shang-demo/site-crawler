import { Component, OnDestroy, OnInit } from '@angular/core';
import { Site } from '../model/site-model';
import { SiteService } from '../site/site.service';
import { MdSnackBar } from '@angular/material';
import { CrawlerRuleService } from '../crawler-rule/crawler-rule.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'site-list',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./site-list.component.scss'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './site-list.component.html',

})

export class SiteListComponent implements OnInit, OnDestroy {

  public sites: Site[] = [];

  private searchItemsSubscription;

  constructor(private siteService: SiteService,
              private crawlerRuleService: CrawlerRuleService,
              private snackBar: MdSnackBar) {
  }

  public openSnackBar() {
    this.snackBar.open('没有更多了~', 'ok', {
      duration: 5000,
    });
  }

  public ngOnDestroy(): void {
    this.searchItemsSubscription.unsubscribe();
  }

  public ngOnInit() {
    this.updateSiteFilter();

    this.searchItemsSubscription = this.siteService.searchItems
      .subscribe((sites) => {
        if (!sites) {
          this.sites = [];
          return null;
        }

        if (!sites.length) {
          this.openSnackBar();
        }

        this.sites.push(...sites);
      });

    this.siteService.scrollDown(true);
  }

  public onScrollDown() {
    this.siteService.scrollDown();
  }

  public updateSiteFilter() {
    this.crawlerRuleService.query()
      .subscribe((remoteRules) => {
        let localRules = [];

        try {
          localRules = JSON.parse(localStorage.getItem('localRules')) || [];
        } catch (e) {
          console.warn(e);
        }

        this.crawlerRuleService.mergeRules(remoteRules, localRules);
      }, (e) => {
        console.warn(e);
        this.snackBar.open('获取服务器配合出错了~', 'ok', {
          duration: 5000,
        });
      });
  }
}
