import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { SiteService } from '../site/site.service';

@Component({
  selector: 'site-setting',  // <home></home>
  providers: [],
  styleUrls: ['./site-setting.component.scss'],
  templateUrl: './site-setting.component.html',
})

export class SiteSettingComponent implements OnInit {
  public sites = [{
    site: 'zd',
    description: '专注绿软，分享软件、传递最新软件资讯',
    updatedAt: null,
  }, {
    site: 'llm',
    description: '浏览迷(原浏览器之家)是一个关注浏览器及软件、IT的科技博客,致力于为广大浏览器爱好者提供一个关注浏览器、交流浏览器、折腾浏览器的专门网站',
    updatedAt: null,
  }, {
    site: 'xclient',
    description: '爱Q生活网 - 亮亮\'blog -关注最新QQ活动动态, 掌握QQ第一资讯',
    updatedAt: null,
  }];

  constructor(public dialogRef: MdDialogRef<SiteSettingComponent>,
              public siteService: SiteService) {

    console.info('dialogRef: ', dialogRef);
  }

  public ngOnInit(): void {
    this.sites.forEach((site) => {
      delete site.updatedAt;
    });

    this.siteService.sites.forEach((name) => {
      this.siteService.crawlerRecord(name)
        .subscribe((result) => {
          this.sites.forEach((site) => {
            if (site.site === result.site) {
              site.updatedAt = result.updatedAt;
            }
          });
          console.info('this.sites: ', this.sites);
        });
    });
  }
}
