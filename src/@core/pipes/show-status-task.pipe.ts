import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showStatusTask'})
export class ShowStatusTaskPipe implements PipeTransform {
  transform(value: number): string {
    let html = value + '';
    if(value == 1) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>'
    } else if (value === 0) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Thất bại</span>'
    } else if ( (value >=10 && value <= 19) || (value >= 31 && value <= 39)) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ duyệt</span>'
    } else if (value === 30) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ duyệt</span>'
    }
    return html;
  }
}