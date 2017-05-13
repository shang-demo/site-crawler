import { Pipe, PipeTransform } from '@angular/core';
import { SiteService } from './site.service';
@Pipe({
  name: 'siteImg',
})

export class SiteImgPipe implements PipeTransform {

  private imgServerUrl = this.siteService.imgServerUrl + '?url=';

  public constructor(private siteService: SiteService) {
  }

  public transform(img: string) {
    if (/data:image/.test(img)) {
      return img;
    }

    return this.imgServerUrl + encodeURIComponent(img);
  }
}
