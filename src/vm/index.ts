import BB, { TimeoutError } from 'bluebird';
import { resolve as pathResolve } from 'path';
import { Worker } from 'worker_threads';

import { Errors, try2error } from '../common/error';
import { getEndpoint } from '../headless/global-browser';
import { PuppeteerMock } from '../headless/puppeteer';
import { WorkLogType, WorkResult, WorkResultType } from './interface';

async function killVm(worker: Worker, browserWSEndpoint: string, targetIdList: string[]) {
  worker.removeAllListeners();
  await worker.terminate();

  const puppeteer = new PuppeteerMock();
  const browser = await puppeteer.connect({ browserWSEndpoint });

  const pages = await browser.pages();

  await Promise.all(
    pages.map(async (page) => {
      // eslint-disable-next-line no-underscore-dangle
      const targetId = (page.target() as any)._targetId;

      if (targetIdList.includes(targetId)) {
        try {
          await page.close();
        } catch (e) {
          // do nothing
        }
      }
    })
  );
}

async function run(
  { code, timeout = 60 * 1000 }: { code: string; timeout?: number },
  emit?: (data: any, event: any) => void
) {
  const filename = pathResolve(__dirname, './puppeteer.worker.js');
  const browserWSEndpoint = await getEndpoint();

  console.info('worker: ', { browserWSEndpoint, timeout });

  const targetIdList: string[] = [];
  const worker = new Worker(filename, {
    workerData: {
      code,
      browserWSEndpoint,
      timeout,
    },
  });

  try {
    const result = await new BB<any>((resolve, reject) => {
      worker.on('message', ({ type, data }: WorkResult) => {
        console.info('message data: ', data);

        if (emit) {
          emit(data, type);
        }

        switch (type) {
          case WorkResultType.PAGE_CREATE:
            targetIdList.push(data.targetId);
            break;
          case WorkResultType.RETURN:
            resolve(data);
            break;
          case WorkResultType.ERROR:
            reject(try2error(data));
            break;
          case WorkLogType.DEBUG:
          case WorkLogType.ERROR:
          case WorkLogType.INFO:
          case WorkLogType.LOG:
          case WorkLogType.WARN:
          case 'FILE':
            break;
          default:
            reject(new Errors.VMError({ type, data }));
            break;
        }
      });
      worker.once('error', reject);
      worker.once('exit', (exitCode) => {
        console.debug('worker exit......', exitCode);

        if (exitCode !== 0) {
          reject(new Errors.VMError({ exitCode }));
        } else {
          reject(new Errors.VMError({ exitCode }, 'no data return'));
        }
      });
    })
      .then((data) => {
        return try2error(data);
      })
      .then((o) => {
        if (o instanceof Errors.OperationalError) {
          throw o;
        }

        return o;
      })
      .timeout(timeout)
      .finally(() => {
        return killVm(worker, browserWSEndpoint, targetIdList);
      });

    return result;
  } catch (e) {
    console.warn(e);

    if (e instanceof TimeoutError) {
      throw new Errors.Timeout({ timeout });
    }

    throw e;
  }
}

export { run };
