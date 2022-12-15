import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showStatusSim'})
export class ShowStatusSimPipe implements PipeTransform {
    transform(value: number): string {
        let html = '';
        if (value === 0) {
            html = '<span class="badge badge-pill badge-light-info mr-1">Chờ duyệt</span>'
        } else if (value === 1) {
            html = '<span class="badge badge-pill badge-light-info mr-1">Đã kích hoạt</span>'
        } else if (value === 2 ) {
            html = '<span class="badge badge-pill badge-light-success mr-1">Đang bán</span>'
        } else if (value === 3 ) {
            html = '<span class="badge badge-pill badge-light-danger mr-1">Đang khóa/span>'
    }
    return html;
}
}
