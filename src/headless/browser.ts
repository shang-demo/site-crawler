import { Browser, Page } from 'puppeteer';

function getMockBrowser(browser: Browser) {
  const openedPages: Page[] = [];

  return new Proxy(browser, {
    get(target, name) {
      if (name === 'newPage') {
        return async () => {
          const page = await Reflect.apply(target[name], target, []);
          openedPages.push(page);
          return page;
        };
      }

      if (name === 'originClose') {
        return Reflect.get(target, 'close');
      }

      if (name === 'close') {
        return async () => {
          while (openedPages.length) {
            const page = openedPages.shift();
            // eslint-disable-next-line no-await-in-loop
            await page?.close();
          }
        };
      }

      return Reflect.get(target, name);
    },
  });
}

export { getMockBrowser };
