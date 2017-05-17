import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ApplicationRef, NgModule } from '@angular/core';
import { createInputTransfer, createNewHosts, removeNgStyles } from '@angularclass/hmr';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { MaterialModule } from '@angular/material';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from './environment';
import { ROUTES } from './app.routes';
// App is our top level component
import { AppComponent } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState, InternalStateType } from './app.service';
import { HomeComponent } from './home';

import '../styles/styles.scss';
import { SiteListComponent } from './site-list/site-list.component';
import { SiteService } from './site/site.service';
import { SiteSettingComponent } from './site-setting/site-setting.component';
import { BusyModule } from 'angular2-busy';
import { SiteImgPipe } from './site/site-img.pipe';
import { AdminComponent } from './admin/admin.component';
import { CrawlerRuleService } from './crawler-rule/crawler-rule.service';
import { CrawlerRuleListComponent } from './crawler-rule-list/crawler-rule-list.component';
import { CrawlerRuleEditComponent } from './crawler-rule-edit/crawler-rule-edit.component';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState,
];

type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    HomeComponent,
    SiteListComponent,
    SiteSettingComponent,
    SiteImgPipe,
    CrawlerRuleListComponent,
    CrawlerRuleEditComponent,
  ],
  imports: [ // import Angular's modules
    BrowserAnimationsModule,
    BrowserModule,
    BusyModule,
    InfiniteScrollModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    SlimLoadingBarModule.forRoot(),
    RouterModule.forRoot(ROUTES, { useHash: true, preloadingStrategy: PreloadAllModules }),
  ],
  entryComponents: [
    SiteSettingComponent,
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    SiteService,
    CrawlerRuleService,
  ],
})
export class AppModule {

  constructor(public appRef: ApplicationRef,
              public appState: AppState) {
  }

  public hmrOnInit(store: StoreType) {
    if (!store || !store.state) {
      return;
    }
    console.log('HMR store', JSON.stringify(store, null, 2));
    // set state
    this.appState._state = store.state;
    // set input values
    if ('restoreInputValues' in store) {
      let restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  public hmrOnDestroy(store: StoreType) {
    const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // save state
    const state = this.appState._state;
    store.state = state;
    // recreate root elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // save input values
    store.restoreInputValues = createInputTransfer();
    // remove styles
    removeNgStyles();
  }

  public hmrAfterDestroy(store: StoreType) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }

}
