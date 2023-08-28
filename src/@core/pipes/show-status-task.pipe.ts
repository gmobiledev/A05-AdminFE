import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showStatusTask' })
export class ShowStatusTaskPipe implements PipeTransform {
  transform(value: number): string {
    let html = value + '';

    switch (value) {
      case 1:
        html = '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>'
        break;
      case 0:
        html = '<span class="badge badge-pill badge-light-warning mr-1">Thất bại</span>'
        break;
      case -1:
        html = '<span class="badge badge-pill badge-light-danger mr-1">Từ chối</span>'
        break;
      case 10:
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ KD duyệt</span>'
        break;
      case 20:
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ thanh toán</span>'
        break;
      case 30:
        html = '<span class="badge badge-pill badge-light-warning mr-1">KD duyệt, Chờ KT duyệt</span>'
        break;
      default:
        html = value + '';
    }
    return html;
  }
}