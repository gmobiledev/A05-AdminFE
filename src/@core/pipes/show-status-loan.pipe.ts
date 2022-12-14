import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'showStatusLoan'})
export class ShowStatusLoanPipe implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if(value == 1) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>'
    } else if (value === 0) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Không duyệt</span>'
    } else if (value === 2) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ duyệt</span>'
    } else if (value === 3) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Đã duyệt</span>'
    } else if (value === 4) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ giải ngân</span>'
    } else if (value === 5) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Đã giải ngân</span>'
    }
    return html;
  }
}