import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Site } from '../model/site-model';

@Component({
  selector: 'dialog-preview',
  templateUrl: '../site-list/site-list.component.html',
  styleUrls: ['../site-list/site-list.component.scss'],
})
export class DialogPreviewComponent {
  public constructor(@Inject(MD_DIALOG_DATA) public sites: Site[]) {
  }

  public onScrollDown(...args) {
    console.info(args);
  }
}
