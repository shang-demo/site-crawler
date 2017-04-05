import { Component, OnInit } from '@angular/core';
import { SiteService } from '../site/site.service';
import { MdSnackBar } from '@angular/material';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'home',  // <home></home>
  // We need to tell Angular's Dependency Injection which providers are in our app.
  providers: [],
  // Our list of styles in our component. We may add more to compose many styles together
  styleUrls: ['./home.component.scss'],
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit {

  public updateTime: string;

  constructor(private siteService: SiteService,
              private snackBar: MdSnackBar) {
  }

  public ngOnInit(): void {
    this.siteService.getSiteUpdateTime()
      .subscribe((data) => {
        this.updateTime = data.updateTime;
      });
  }

  public search(key) {
    this.siteService.search(key);
  }

  public forceUpdate() {
    this.siteService.forceUpdate()
      .subscribe((data) => {
        console.info('data: ', data);
        if (data && data.start) {
          this.snackBar.open('开始采集~', 'ok', {
            duration: 5000,
          });
        } else {
          this.snackBar.open('采集时间2分钟内~', 'ok', {
            duration: 5000,
          });
        }
      });
  }

  public reload() {
    this.siteService.scrollDown(true);
  }

}
