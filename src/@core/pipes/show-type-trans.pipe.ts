import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showTrans'})
export class ShowTransPipe implements PipeTransform {
  transform(value ): string {
    let html = '';
    if(value == 0) {
        html = 'Voice'
    } else if (value == 4) {
        html = 'SMS'
    } else if (value == 6) {
      html = 'Data hoặc dịch vụ giá trị gia tăng (gtgt)'
    } else {
      html = value
    }
    return html;
  }
}