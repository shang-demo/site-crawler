import { Component, OnInit } from '@angular/core';
import { CrawlerRule } from '../model/crawler-rule-model';
import { CrawlerRuleService } from '../crawler-rule/crawler-rule.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'crawler-rule-edit',  // <crawler-rule-edit></crawler-rule-edit>
  providers: [],
  styleUrls: ['./crawler-rule-edit.component.scss'],
  templateUrl: './crawler-rule-edit.component.html',
})

export class CrawlerRuleEditComponent implements OnInit {

  public crawlerRule: CrawlerRule = new CrawlerRule();

  constructor(private crawlerRuleService: CrawlerRuleService,
              public router: Router,
              public activeRoute: ActivatedRoute) {
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
          this.crawlerRule = data;
          Object.keys(data).forEach((key) => {
            if (typeof data[key] === 'object') {
              data[key] = JSON.stringify(data[key], null, 2);
            }
          });
          console.info('this.crawlerRule: ', this.crawlerRule);
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
}
