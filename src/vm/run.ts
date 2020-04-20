import dayjs from 'dayjs';
import _ from 'lodash';
import { VM } from 'vm2';
import BB from 'bluebird';

import { PuppeteerMock } from '../headless/puppeteer';
import { Errors } from '../common/error';

function wrapCode(code: string) {
  return `
    // Define inline functions and capture user console logs.
    const log = [];
    const logger = (...args) => log.push(args);
    console.log = logger;
    console.info = logger;
    console.warn = logger;

    // Wrap user code in an async function so async/await can be used out of the box.
    (async() => {
      const data = await (async ()=> { ${code} })(); // user's code

      try {
        await puppeteer.close();
      }
      catch(e) {}

      return { log, data };
    })();
  `;
}

async function run(code: string) {
  const sandbox = {
    setTimeout,
    Promise: BB,
    puppeteer: new PuppeteerMock(),
    _,
    dayjs,
  };

  const runCode = wrapCode(code);

  try {
    const vm = new VM({
      timeout: 60 * 1000,
      sandbox,
    });

    const data = await vm.run(runCode);
    return data;
  } catch (e) {
    console.warn(e);

    throw new Errors.VMError({ code, runCode }, e.message);
  }
}

export { run };
