import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { SiteService } from '../site/site.service';
import { Site } from '../model/site-model';

@Component({
  selector: 'site-setting',  // <home></home>
  providers: [],
  styleUrls: ['./site-setting.component.scss'],
  templateUrl: './site-setting.component.html',
})

export class SiteSettingComponent implements OnInit {
  public sites: Site[] = [{
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
    disabled: true,
    site: 'iqq',
    description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
    href: 'http://www.iqshw.com/',
    updatedAt: null,
  }];

  public ngBusy = [];

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

  constructor(public dialogRef: MdDialogRef<SiteSettingComponent>,
              public siteService: SiteService) {

    console.info('dialogRef: ', dialogRef);
  }

  public ngOnInit(): void {
    this.ngBusy.length = 0;

    this.sites = this.sites.filter((site) => {
      delete site.updatedAt;
      return !site.disabled;
    });

    this.siteService.sites.forEach((name) => {
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
