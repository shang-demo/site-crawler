export class CrawlerRule {
  public site: string;
  public requestOptions?: object;
  public sitemap?: object;
  public transform?: object;
  public pageRule?: string;
  public description?: string;
  public href?: string;
  public isShowArticle?: boolean;
  public isCrawler?: boolean;

  public _id?: string;
  public createdAt?: string;
  public updatedAt?: string;
}
