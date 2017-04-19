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
  public sites = [];

  constructor(public dialogRef: MdDialogRef<SiteSettingComponent>,
              public siteService: SiteService) {

    console.info('dialogRef: ', dialogRef);
  }

  public ngOnInit(): void {
    this.siteService.sites.forEach((name) => {
      this.siteService.crawlerRecord(name)
        .subscribe((result) => {
          console.info('result: ', result);
          this.sites.push(result);
          console.info('this.sites: ', this.sites);
        });
    });
  }
}
