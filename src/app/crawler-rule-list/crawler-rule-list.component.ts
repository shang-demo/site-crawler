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
  public sitesKeyBySite;

  public ngBusy = [];
  private sites: Site[] = [
    {
      site: 'zd',
      description: '专注绿软，分享软件、传递最新软件资讯',
      href: 'http://www.zdfans.com/',
      updatedAt: null,
    }, {
      site: 'llm',
      description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
      href: 'https://liulanmi.com/',
      updatedAt: null,
    }, {
      site: 'xclient',
      description: '精品MAC应用分享，每天分享大量mac软件，为您提供优质的mac破解软件,免费软件下载服务',
      href: 'http://xclient.info/s/',
      updatedAt: null,
    }, {
      site: 'edu-ing',
      description: '嘻哈小屋-嘻哈无极限',
      href: 'http://www.edu-ing.cn/?paged=1',
      updatedAt: null,
    }, {
      disabled: true,
      site: 'iqq',
      description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
      href: 'http://www.iqshw.com/',
      updatedAt: null,
    }];

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
      }, (e) => {
        console.warn(e);
        this.snackBar.open('出错了~', 'ok', {
          duration: 5000,
        });
      });

    this.sitesKeyBySite = this.sites.reduce((result, item) => {
      result[item.site] = item;
      return result;
    }, {});

    Object.keys(this.sitesKeyBySite)
      .forEach((name) => {
        this.ngBusy[name] = {
          busy: this.siteService.crawlerRecord(name)
            .subscribe((result) => {
              this.sites.forEach((site) => {
                if (site.site === result.site) {
                  site.updatedAt = result.updatedAt;
                }
              });
            }),
          message: '',
          wrapperClass: '',
          template: this.busyTemplate,
          backdrop: false,
        };
      });
  }
}
