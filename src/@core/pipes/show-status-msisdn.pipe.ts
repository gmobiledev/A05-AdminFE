import { Pipe, PipeTransform } from '@angular/core';
import { MsisdnStatus, TaskTelecomStatus } from 'app/utils/constants';

@Pipe({name: 'showStatusMsisdn'})
export class ShowStatusMsisdnPipe implements PipeTransform {
  transform(value: number): string {
    let html = value +'';
    if(value === null) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Chưa xử lý</span>'
    } else if (value === MsisdnStatus.STATUS_PROCESSED_MNO_SUCCESS) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Đã đấu nối</span>'
    } else if (value === TaskTelecomStatus.STATUS_CANCEL) {
        html = '<span class="badge badge-pill badge-light-danger mr-1">Đã hủy</span>'
    }
    return html;
  }
}