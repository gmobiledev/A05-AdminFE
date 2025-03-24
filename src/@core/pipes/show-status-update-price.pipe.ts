import { Pipe, PipeTransform } from '@angular/core';
import { StatusUpdatePrice } from 'app/utils/constants';

@Pipe({ name: 'showStatusUpdatePrice' })
export class ShowStatusUpdatePricePipe implements PipeTransform {
    transform(value: number): string {
        let html = "";

        switch (value) {
            case StatusUpdatePrice.INITIALIZE:
                html = '<span class="badge badge-pill badge-light-warning mr-1">Mới khởi tạo</span>'
                break;
            case StatusUpdatePrice.RECEPTION:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã tiếp nhận/đang xử lý</span>'
                break;
            case StatusUpdatePrice.REFUSE:
                html = '<span class="badge badge-pill badge-light-danger mr-1">Đã từ chối</span>'
                break;
            case StatusUpdatePrice.APPROVE:
                html = '<span class="badge badge-pill badge-light-info mr-1">Đã duyệt</span>'
                break;
            default:
                html = value + '';
        }

        return html;
    }
}