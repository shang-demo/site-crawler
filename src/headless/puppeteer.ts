import puppeteer, { Browser, ConnectOptions, LaunchOptions } from 'puppeteer';

import { getMockBrowser } from './browser';
import { getEndpoint } from './global-browser';

class PuppeteerMock {
  private browser: Browser | undefined;

  public async connect(options: ConnectOptions) {
    const browserWSEndpoint = await getEndpoint();

    const originBrowser = await puppeteer.connect({
      ...options,
      browserWSEndpoint,
    });

    this.browser = getMockBrowser(originBrowser);
    return this.browser;
  }

  public async launch(options: LaunchOptions | ConnectOptions) {
    return this.connect(options);
  }

  public async close() {
    await this.browser?.close();
  }
}

export { PuppeteerMock };
