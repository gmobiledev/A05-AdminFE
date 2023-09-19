import { Pipe, PipeTransform } from '@angular/core';
import { TaskTelecomStatus } from 'app/utils/constants';

@Pipe({name: 'showStatusTelecom'})
export class ShowStatusTelecomPipe implements PipeTransform {
  transform(value: number): string {
    let html = '';
    if(value == TaskTelecomStatus.STATUS_NEW_ORDER) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Mới khởi tạo</span>'
    } else if (value === TaskTelecomStatus.STATUS_PROCESSING) {
        html = '<span class="badge badge-pill badge-light-info mr-1">Đã tiếp nhận/đang xử lý</span>'
    } else if (value === TaskTelecomStatus.STATUS_PROCESS_TO_MNO) {
        html = '<span class="badge badge-pill badge-light-info mr-1">Đã đẩy sang nhà mạng</span>'
    } else if (value === TaskTelecomStatus.STATUS_SUCCESS) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>'
    } else if (value === TaskTelecomStatus.STATUS_REJECT) {
        html = '<span class="badge badge-pill badge-light-danger mr-1">Đã từ chối</span>'
    } else if (value === TaskTelecomStatus.STATUS_CANCEL) {
        html = '<span class="badge badge-pill badge-light-danger mr-1">Đã hủy</span>'
    } else if (value === TaskTelecomStatus.STATUS_INIT) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Đại lý chưa hoàn thiện thông tin</span>'
    } else if (value === TaskTelecomStatus.STATUS_SUCCESS_PART) {
        html = '<span class="badge badge-pill badge-light-success mr-1">Thành công 1 phần</span>'
    } else if (value === TaskTelecomStatus.STATUS_INIT_2G_GSIM) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Yêu cầu đổi 2G mới</span>'
    } else if ([TaskTelecomStatus.STATUS_APPROVED_1, TaskTelecomStatus.STATUS_APPROVED_2, TaskTelecomStatus.STATUS_APPROVED_3]
        .includes(value)) { 
            html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ DVKH/KD duyệt</span>'
    } else if (value === TaskTelecomStatus.STATUS_DVKHKD_REJECT) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">DVKH/KD từ chối</span>'
    } else if (value == TaskTelecomStatus.STATUS_NEW_ORDER_ORGANIZATION) {
        html = '<span class="badge badge-pill badge-light-warning mr-1">Mới khởi tạo</span>'
    }  else if (value == TaskTelecomStatus.STATUS_APPROVED) {
        html = '<span class="badge badge-pill badge-light-info mr-1">Đã duyệt</span>'
    }
    return html;
  }
}