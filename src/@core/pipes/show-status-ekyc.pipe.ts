import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showStatusEkyc'})
export class ShowStatusEkycPipe implements PipeTransform {
  transform(value: any): string {
    let html = '';
    if(value == 'APPROVED') {
        html = '<span class="badge badge-pill badge-light-success mr-1">Đã định danh</span>'
    } else {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chưa định danh</span>'
    }
    return html;
  }
}