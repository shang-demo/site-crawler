import BB from 'bluebird';
import dayjs from 'dayjs';
import _ from 'lodash';
import { VM } from 'vm2';
import { parentPort, workerData } from 'worker_threads';

import { Errors } from '../common/error';
import { PuppeteerMock } from '../headless/puppeteer';
import { WorkResultType } from './interface';

function wrapCode(code: string) {
  return `
    // Define inline functions and capture user console logs.
    const log = [];
    const logger = (...args) => { 
      log.push(args);

      if (log.length > 100) { 
        log.shift();  
      } 
    };
    console.log = logger;
    console.info = logger;
    console.warn = logger;

    // Wrap user code in an async function so async/await can be used out of the box.
    (async() => {
      const data = await (async ()=> { ${code} })(); // user's code
      return { log, data };
    })();
  `;
}

async function run({ code, browserWSEndpoint }: { code: string; browserWSEndpoint: string }) {
  const puppeteer = new PuppeteerMock();
  const browser = await puppeteer.connect({ browserWSEndpoint }, (page) => {
    parentPort?.postMessage({
      type: WorkResultType.PAGE_CREATE,
      data: {
        // eslint-disable-next-line no-underscore-dangle
        targetId: (page.target() as any)._targetId,
      },
    });
  });
  const sandbox = {
    setTimeout,
    setInterval,
    setImmediate,

    _,
    dayjs,
    Promise: BB,

    puppeteer,
    browser,
  };

  const runCode = wrapCode(code);

  try {
    const vm = new VM({ sandbox });

    const data = await vm.run(runCode);
    await puppeteer.close();

    return data;
  } catch (e) {
    console.warn(e);
    await puppeteer.close();

    throw new Errors.VMError({ code, runCode }, e.message);
  }
}

(async () => {
  try {
    const data = await run(workerData);

    try {
      parentPort?.postMessage({ type: WorkResultType.RETURN, data });
    } catch (e) {
      console.warn(e);

      parentPort?.postMessage({
        type: WorkResultType.RETURN,
        data: {
          log: [
            e.message,
            'log format failed, see https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm',
          ],
          data: data.data,
        },
      });
    }
  } catch (e) {
    console.warn(e);

    let data;

    if (e instanceof Errors.OperationalError) {
      data = e.toJSON();
    } else {
      data = new Errors.VMError(workerData, e.message).toJSON();
    }

    parentPort?.postMessage({ type: WorkResultType.ERROR, data });
  }
})();
