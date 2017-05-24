import { Component, OnInit } from '@angular/core';
import { CrawlerRuleService } from '../crawler-rule/crawler-rule.service';
import { CrawlerRule } from '../model/crawler-rule-model';
import { MdSnackBar } from '@angular/material';
import { Site } from '../model/site-model';
import { SiteService } from '../site/site.service';

@Component({
  selector: 'crawler-rule-list',  // <crawler-rule-list></crawler-rule-list>
  providers: [],
  styleUrls: ['./crawler-rule-list.component.scss'],
  templateUrl: './crawler-rule-list.component.html',
})

export class CrawlerRuleListComponent implements OnInit {

  public crawlerRules: CrawlerRule[];

  public ngBusy = [];

  public serverUrl = 'SERVER_URL';

  private busyTemplate = `<div class="ng-busy-default-spinner">
      <div class="bar1"></div>
      <div class="bar2"></div>
      <div class="bar3"></div>
      <div class="bar4"></div>
      <div class="bar5"></div>
      <div class="bar6"></div>
      <div class="bar7"></div>
      <div class="bar8"></div>
      <div class="bar9"></div>
      <div class="bar10"></div>
      <div class="bar11"></div>
      <div class="bar12"></div>
  </div>`;

  public constructor(private snackBar: MdSnackBar,
                     private crawlerRuleService: CrawlerRuleService,
                     public siteService: SiteService) {
  }

  public ngOnInit() {
    console.log('hello `Crawler-Rule-List` component');

    this.crawlerRuleService.query()
      .subscribe((data) => {
        this.crawlerRules = data;
        this.getRecords(data);
      }, (e) => {
        console.warn(e);
        this.snackBar.open('出错了~', 'ok', {
          duration: 5000,
        });
      });
  }

  public toggle(rule) {
    this.crawlerRuleService
      .save({
        _id: rule._id,
        site: rule.site,
        isShowArticle: rule.isShowArticle,
        isCrawler: rule.isCrawler,
      })
      .subscribe(() => {
        this.snackBar.open('保存成功', 'ok', {
          duration: 1000,
        });
      }, (e) => {
        console.warn(e);
        this.snackBar.open('出错了~', 'ok', {
          duration: 5000,
        });
      });
  }

  private getRecords(crawlerRules) {
    crawlerRules.forEach((item) => {
      this.getRecord(item.site);
    });
  }

  private getRecord(name) {
    this.ngBusy[name] = {
      busy: this.siteService.crawlerRecord(name)
        .subscribe((result) => {
          this.crawlerRules.forEach((rule) => {
            if (rule.site === result.site) {
              rule.updatedAt = result.updatedAt;
            }
          });
        }),
      message: '',
      wrapperClass: '',
      template: this.busyTemplate,
      backdrop: false,
    };
  }
}
