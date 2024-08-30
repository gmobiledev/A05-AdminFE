import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showStatusTrans'})
export class ShowStatusTransPipe implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if(value == 1) {
        html = 'ACTIVE'
    } else if (value == 90) {
        html = 'Khóa 1 chiều'
    } else if (value == 93) {
      html = 'Khóa 2 chiều'
    } else if (value == 95) {
        html = 'Chuẩn bị thu hồi'
    } else if (value == 99) {
        html = 'Thu hồi'
    }
    return html;
  }
}