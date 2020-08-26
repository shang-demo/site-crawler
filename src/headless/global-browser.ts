import puppeteer, { Browser } from 'puppeteer';

let globalBrowser: Promise<Browser> | undefined;
async function getBrowser() {
  if (!globalBrowser) {
    globalBrowser = puppeteer.launch({
      args: ['--no-sandbox'],
      executablePath: process.env.CHROME,
      headless: !process.env.CHROME,
    });
  }

  return globalBrowser;
}

async function getEndpoint() {
  const browser = await getBrowser();
  return browser.wsEndpoint();
}

async function clean() {
  if (!globalBrowser) {
    return { len: 0 };
  }

  const browser = await globalBrowser;
  globalBrowser = undefined;

  const pages = await browser.pages();
  await browser.close();

  return {
    len: pages.length,
  };
}

export { getEndpoint, clean, getBrowser };
