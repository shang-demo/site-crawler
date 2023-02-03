import BB from 'bluebird';
import dayjs from 'dayjs';
import { ensureFile, readFile, writeFile } from 'fs-extra';
import _ from 'lodash';
import { resolve as pathResolve } from 'path';
import { KnownDevices } from 'puppeteer';
import { v4 } from 'uuid';
import { VM } from 'vm2';
import { parentPort, workerData } from 'worker_threads';

import { FILE_ROOT } from '../common/constant';
import { Errors } from '../common/error';
import { PuppeteerMock } from '../headless/puppeteer';
import { WorkLogType, WorkResultType } from './interface';

const USER_FILE_ROOT = pathResolve(FILE_ROOT, v4());

async function writeFileAsync(filename: string, data: any) {
  const p = pathResolve(USER_FILE_ROOT, filename);

  await ensureFile(p);
  await writeFile(p, data);

  try {
    parentPort?.postMessage({
      type: 'FILE',
      data: { filename, path: p.replace(FILE_ROOT, '') },
    });
  } catch (e) {
    console.warn(e);
  }
}

async function readFileAsync(filename: string, options?: any) {
  const p = pathResolve(USER_FILE_ROOT, filename);

  return readFile(p, options);
}

function wrapCode(code: string) {
  return `
    (async() => {
      ${code}
    })();
  `;
}

function wrapLog(type: WorkLogType, data: any[]) {
  try {
    parentPort?.postMessage({
      type,
      data: [new Date().toISOString(), ...data],
    });
  } catch (e) {
    console.warn(e);
  }
}

async function run({
  code,
  browserWSEndpoint,
}: {
  code: string;
  browserWSEndpoint: string;
}) {
  const puppeteer = new PuppeteerMock();
  const browser = await puppeteer.connect({ browserWSEndpoint }, (page) => {
    parentPort?.postMessage({
      type: WorkResultType.PAGE_CREATE,
      data: {
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
    DeviceDescriptors: KnownDevices,

    writeFileAsync,
    readFileAsync,
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
  } catch (e: any) {
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
  } catch (e: any) {
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
