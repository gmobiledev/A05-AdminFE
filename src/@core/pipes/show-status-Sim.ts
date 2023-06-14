import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'showStatusSim' })
export class ShowStatusSimPipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case 0:
              return '<span class="badge badge-pill badge-light-info mr-1">Chờ duyệt</span>'
            case 1:
              return '<span class="badge badge-pill badge-light-info mr-1">Đã kích hoạt</span>'
            case 2:
              return '<span class="badge badge-pill badge-light-success mr-1">Đang bán</span>'
            case 3:
              return '<span class="badge badge-pill badge-light-danger mr-1">Đang khóa</span>'
            case 30:
              return '<span class="badge badge-pill badge-light-danger mr-1">Đang khóa - Nợ cước 2G</span>'
            default:
              return value.toString();
          }
    }
}
