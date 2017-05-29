import { Component, OnInit } from '@angular/core';
import { CrawlerRule } from '../model/crawler-rule-model';
import { CrawlerRuleService } from '../crawler-rule/crawler-rule.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MdDialog } from '@angular/material';
import { DialogPreviewComponent } from '../dialog-preview/dialog-preview.component';

@Component({
  selector: 'crawler-rule-edit',
  providers: [],
  styleUrls: ['./crawler-rule-edit.component.scss'],
  templateUrl: './crawler-rule-edit.component.html',
})
export class CrawlerRuleEditComponent implements OnInit {
  public crawlerRule: CrawlerRule = new CrawlerRule();
  public crawlerRuleImportExport: string;
  public isShowImport: boolean = false;
  public isShowExport: boolean = false;

  constructor(private crawlerRuleService: CrawlerRuleService,
              public router: Router,
              public activeRoute: ActivatedRoute,
              public dialog: MdDialog) {
  }

  public washCrawlerRule(data) {
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object') {
        data[key] = JSON.stringify(data[key], null, 2);
      }
    });
    console.info('this.crawlerRule: ', data);
    return data;
  }

  public ngOnInit() {
    console.log('hello `Crawler-Rule-Edit` component');

    this.activeRoute.params.subscribe((params) => {
      if (!params.id) {
        this.crawlerRule = {
          site: '',
          isShowArticle: true,
          isCrawler: true,
        };
        return;
      }

      this.crawlerRuleService.get(params.id)
        .subscribe((data) => {
          this.crawlerRule = this.washCrawlerRule(data);
        });
    });
  }

  public save() {
    this.crawlerRuleService.save(this.crawlerRule)
      .subscribe((data) => {
        console.info(data);
        this.router.navigateByUrl('/rule-list');
      });
  }

  public importCrawlerRule() {
    let rule;
    try {
      rule = JSON.parse(this.crawlerRuleImportExport);
      this.crawlerRule = this.washCrawlerRule(rule);
    } catch (e) {
      console.warn(e);
    }
  }

  public exportCrawlerRule() {
    this.isShowImport = false;
    this.isShowExport = !this.isShowExport;

    let rule = {};
    Object.keys(this.crawlerRule).forEach((key) => {
      try {
        if (typeof this.crawlerRule[key] === 'string') {
          rule[key] = JSON.parse(this.crawlerRule[key]);
        }
      } catch (e) {
        console.warn(e);
      }

      if (!rule[key]) {
        rule[key] = this.crawlerRule[key];
      }
    });
    try {
      this.crawlerRuleImportExport = JSON.stringify(rule, null, 2);
    } catch (e) {
      console.warn(e);
    }
  }

  public preview() {
    this.crawlerRuleService.preview(this.crawlerRule)
      .subscribe((arr) => {
        console.info('preview: ', arr);

        arr = arr.map((item) => {
          item.site = this.crawlerRule.site;
          return item;
        });

        this.dialog.open(DialogPreviewComponent, {
          data: arr,
          height: '500px',
        });
      });
  }
}
