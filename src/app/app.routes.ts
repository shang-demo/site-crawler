import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { SiteListComponent } from './site-list/site-list.component';
import { CrawlerRuleListComponent } from './crawler-rule-list/crawler-rule-list.component';
import { CrawlerRuleEditComponent } from './crawler-rule-edit/crawler-rule-edit.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'rule-detail', component: CrawlerRuleEditComponent },
  { path: 'rule-detail/:id', component: CrawlerRuleEditComponent },
  { path: 'rule-list', component: CrawlerRuleListComponent },
  { path: 'site-list', component: SiteListComponent },
];
