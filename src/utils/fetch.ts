import { ArticleType } from '../components/article';

class MyFetch {
  public serverUrl = 'https://site-crawler-backend.xinshangshangxin.com';

  public async next({
    inputPage = 1,
    search = '',
    inputLimit = 10,
    sites = [] as string[],
  }: {
    inputPage?: number;
    search?: string;
    inputLimit?: number;
    sites?: string[];
  } = {}): Promise<ArticleType[]> {
    const page = `${inputPage}`;
    const limit = `${inputLimit}`;

    const qs = new URLSearchParams({ page, search, limit });
    sites.forEach((v) => {
      qs.append('sites', v);
    });
    return fetch(`${this.serverUrl}/api/v1/article?${qs}`).then((res) => {
      return res.json();
    });
  }

  public async sites() {
    return fetch(`${this.serverUrl}/api/v1/crawler-rule`)
      .then((res) => {
        return res.json();
      })
      .then((data: { site: string }[]) => {
        return data
          .map(({ site }) => {
            return site;
          })
          .sort();
      });
  }

  public async time(): Promise<Date> {
    return fetch(`${this.serverUrl}/api/v1/record/update-time`)
      .then((res) => {
        return res.json();
      })
      .then((data: { updateTime: string }) => {
        return new Date(data.updateTime);
      });
  }
}

const myFetch = new MyFetch();

export { myFetch };
