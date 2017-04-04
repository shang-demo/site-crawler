import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { SiteListComponent } from './site-list/site-list.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'site-list', component: SiteListComponent },
];
