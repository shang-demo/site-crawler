const puppeteer = require('puppeteer');
const BB = require('bluebird');
const dayjs = require('dayjs');
const _ = require('lodash');

global.puppeteer = puppeteer;
global.Promise = BB;
global.dayjs = dayjs;
global._ = _;
global.browser = undefined;

let globalBrowser = undefined;
async function getBrowser() {
  if (!globalBrowser) {
    globalBrowser = await puppeteer.launch({
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

async function init() {
  const browserWSEndpoint = await getEndpoint();
  const browser = await puppeteer.connect({ browserWSEndpoint });

  global.browser = browser;
}

module.exports = { init };
