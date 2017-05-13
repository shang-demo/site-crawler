import { Component, OnDestroy, OnInit } from '@angular/core';
import { Site } from '../model/site-model';
import { SiteService } from '../site/site.service';
import { MdSnackBar } from '@angular/material';

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

    this.siteService.scrollDown();
  }

  public onScrollDown() {
    this.siteService.scrollDown();
  }
}
