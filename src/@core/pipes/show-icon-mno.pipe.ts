import { Pipe, PipeTransform } from '@angular/core';
import { TaskTelecomStatus } from 'app/utils/constants';

@Pipe({name: 'showIconMno'})
export class ShowIconMnoPipe implements PipeTransform {
  transform(value: string): string {
    let html = value;
    if (value == 'VNM') {
      html = '<img class="img-icon-mno" width="30px"  src="/assets/images/mno/vnm.png">'
    } else if (value == 'VMS') {
      html = '<img class="img-icon-mno" width="35px"  src="/assets/images/mno/mobifone.png">'
    } else if (value == 'GMOBILE') {
      html = '<img class="img-icon-mno" width="30px"  src="/assets/images/mno/gmobile.png">'
    } else if (value == 'VNP') {
      html = '<img class="img-icon-mno" width="30px"  src="/assets/images/mno/vnp.png">'
    } 
    return html;
  }
}