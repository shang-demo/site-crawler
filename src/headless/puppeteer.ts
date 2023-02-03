import puppeteer, { Browser, ConnectOptions, Page } from 'puppeteer';

import { getMockBrowser } from './browser';
import { getEndpoint } from './global-browser';

class PuppeteerMock {
  private browser: Browser | undefined;

  public async close() {
    await this.browser?.close();
  }

  public async connect(
    options?: ConnectOptions,
    afterPageCreate = (page: Page): any => {
      return page;
    },
  ) {
    if (this.browser) {
      return this.browser;
    }

    let browserWSEndpoint;

    if (!options?.browserWSEndpoint) {
      browserWSEndpoint = await getEndpoint();
    } else {
      browserWSEndpoint = options.browserWSEndpoint;
    }

    const originBrowser = await puppeteer.connect({
      ...options,
      browserWSEndpoint,
    });

    this.browser = getMockBrowser(originBrowser, afterPageCreate);
    return this.browser;
  }

  public async launch(options: ConnectOptions) {
    return this.connect(options);
  }
}

export { PuppeteerMock };
