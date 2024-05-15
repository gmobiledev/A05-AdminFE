import { Pipe, PipeTransform } from '@angular/core';
import { BatchStatus } from 'app/utils/constants';

@Pipe({name: 'showStatusBatch'})
export class ShowStatusBatchPipe implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if(value == BatchStatus.COMPLETED) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Hoàn thành</span>' // ko 
    } else if (value === BatchStatus.INIT) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ duyệt</span>' // 2 nút
    } else if (value === BatchStatus.APPROVED) {
      html = '<span class="badge badge-pill badge-light-success mr-1">Đã duyệt</span>' // 1 nút
    }  else if (value === BatchStatus.APPROVED_BY_ACCOUNTANT) {
      html = '<span class="badge badge-pill badge-light-info mr-1">Kế toán duyệt</span>' // 1 nút
    } else if (value === BatchStatus.CANCEL_BY_ACCOUNTANT) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Kế toán từ chối</span>' // 1 nút
    } else if (value === BatchStatus.CANCEL_BY_OFFICE) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">VP từ chối</span>' // 1 nút
    } else if (value === BatchStatus.CANCEL_BY_USER) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">User từ chối</span>' // 1 nút
    }
     else if (value === BatchStatus.CANCEL) {
      html = '<span class="badge badge-pill badge-light-danger mr-1">Không duyệt</span>' // ko
    }else{
        html =  '<span class="badge badge-pill mr-1 badge-light-warning">' + value + '</span>'
    }
    return html;
  }
}