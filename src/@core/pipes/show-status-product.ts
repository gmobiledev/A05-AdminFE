import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showStatusProduct' })
export class ShowStatusProductPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 0:
              return '<span class="badge badge-pill badge-light-info mr-1">Chờ duyệt</span>'
            case 1:
              return '<span class="badge badge-pill badge-light-info mr-1">Đã bán</span>'
            case 2:
              return '<span class="badge badge-pill badge-light-success mr-1">Đang bán</span>'
            case 3:
              return '<span class="badge badge-pill badge-light-danger mr-1">Đang khóa</span>'
            case 30:
              return '<span class="badge badge-pill badge-light-danger mr-1">Đang khóa - Nợ cước 2G</span>'
            case 99:
              return '<span class="badge badge-pill badge-light-danger mr-1">Thu hồi</span>'
            default:
              return value.toString();
          }
    }
}
