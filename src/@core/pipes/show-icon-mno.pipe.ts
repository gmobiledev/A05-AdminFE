import { Pipe, PipeTransform } from '@angular/core';
import { TaskTelecomStatus } from 'app/utils/constants';

@Pipe({name: 'showIconMno'})
export class ShowIconMnoPipe implements PipeTransform {
  transform(value: string): string {
    let html = '';
    if(value == 'VNM') {
        html = '<img class="img-icon-mno"  src="/assets/images/mno/vnm.png">'
    } else if (value == 'VMS') {
        html = '<img class="img-icon-mno"  src="/assets/images/mno/mobifone.png">'
    } 
    return html;
  }
}