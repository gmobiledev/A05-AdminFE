import { Pipe, PipeTransform } from '@angular/core';
import { TaskTelecomStatus } from 'app/utils/constants';

@Pipe({ name: 'showStatusTelecom' })
export class ShowStatusTelecomPipe implements PipeTransform {
    transform(value: number): string {
        let html = "";

        switch (value) {
            case TaskTelecomStatus.STATUS_NEW_ORDER:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Mới khởi tạo</span>'
                break;
            case TaskTelecomStatus.STATUS_PROCESSING:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã tiếp nhận/đang xử lý</span>'
                break;
            case TaskTelecomStatus.STATUS_PROCESS_TO_MNO:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã đẩy sang nhà mạng</span>'
                break;
            case TaskTelecomStatus.STATUS_SUCCESS:
                html = '<span class="badge badge-pill badge-light-success mr-1">Thành công</span>'
                break;
            case TaskTelecomStatus.STATUS_REJECT:
                html = '<span class="badge badge-pill badge-light-danger mr-1">Đã từ chối</span>'
                break;
            case TaskTelecomStatus.STATUS_CANCEL:
                html = '<span class="badge badge-pill badge-light-danger mr-1">Đã hủy</span>'
                break;
            case TaskTelecomStatus.STATUS_INIT:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Đại lý chưa hoàn thiện thông tin</span>'
                break;
            case TaskTelecomStatus.STATUS_SUCCESS_PART:
                html = '<span class="badge badge-pill badge-light-success mr-1">Thành công 1 phần</span>'
                break;
            case TaskTelecomStatus.STATUS_INIT_2G_GSIM:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ thanh toán</span>'
                break;
            case TaskTelecomStatus.STATUS_APPROVED_1:
            case TaskTelecomStatus.STATUS_APPROVED_2:
            case TaskTelecomStatus.STATUS_APPROVED_3:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Chờ DVKH/KD duyệt</span>'
                break;
            case TaskTelecomStatus.STATUS_DVKHKD_REJECT:
                html = '<span class="badge badge-pill badge-light-warning mr-1">DVKH/KD từ chối</span>'
                break;
            case TaskTelecomStatus.STATUS_NEW_ORDER_ORGANIZATION:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Mới khởi tạo (Doanh nghiệp)</span>'
                break;
            case TaskTelecomStatus.STATUS_APPROVED:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã duyệt</span>'
                break;
            case TaskTelecomStatus.STATUS_WAITING_SIM:
                html = '<span class="badge badge-pill badge-light-info mr-1">Chờ thông tin SIM</span>'
                break;
            case TaskTelecomStatus.STATUS_PAID_WAITING_EKYC:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã thanh toán</span>'
                break;
            case TaskTelecomStatus.STATUS_PAID_SUSPENDING:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Đã Thanh toán & Đình chỉ</span>'
                break;
            case TaskTelecomStatus.STATUS_PAID_TERMINATED:
                html = '<span class="badge badge-pill badge-light-danger mr-1">Đã Thanh toán & Thu hồi</span>'
                break;
            case TaskTelecomStatus.STATUS_WAITING_CONTRACT:
                html = '<span class="badge badge-pill badge-light-info mr-1">Chờ ký Phiếu/HĐ</span>'
                break;
            case TaskTelecomStatus.WAITING_FOR_ACTIVATION:
                html = '<span class="badge badge-pill badge-light-info mr-1">Chờ kích hoạt</span>'
                break;
            case TaskTelecomStatus.STATUS_FAIL:
                html = '<span class="badge badge-pill badge-light-info mr-1">Thất bại</span>'
                break;
            case TaskTelecomStatus.STATUS_WAITING:
                html = '<span class="badge badge-pill badge-light-info mr-1">Chờ xử lý</span>'
                break;
            case TaskTelecomStatus.STATUS_WAITING_REFUND:
                html = '<span class="badge badge-pill badge-light-info mr-1">Chờ hoàn tiền</span>'
                break;
            case TaskTelecomStatus.STATUS_REFUNDED:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã hoàn tiền</span>'
                break;

            default:
                html = value + '';
        }

        return html;
    }
}