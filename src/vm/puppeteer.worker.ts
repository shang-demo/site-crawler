import BB from 'bluebird';
import dayjs from 'dayjs';
import _ from 'lodash';
import { VM } from 'vm2';
import { parentPort, workerData } from 'worker_threads';

import { Errors } from '../common/error';
import { PuppeteerMock } from '../headless/puppeteer';
import { WorkLogType, WorkResultType } from './interface';

function wrapCode(code: string) {
  return `
    (async() => {
      ${code}
    })();
  `;
}

function wrapLog(type: WorkLogType, data: any[]) {
  try {
    parentPort?.postMessage({ type, data });
  } catch (e) {
    console.warn(e);
  }
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

    console: {
      log: (...args: any[]) => {
        wrapLog(WorkLogType.LOG, args);
      },
      info: (...args: any[]) => {
        wrapLog(WorkLogType.INFO, args);
      },
      warn: (...args: any[]) => {
        wrapLog(WorkLogType.WARN, args);
      },
      error: (...args: any[]) => {
        wrapLog(WorkLogType.ERROR, args);
      },
      debug: (...args: any[]) => {
        wrapLog(WorkLogType.DEBUG, args);
      },
    },
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
        data: JSON.parse(JSON.stringify(data)),
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
