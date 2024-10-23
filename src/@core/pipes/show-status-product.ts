import { Pipe, PipeTransform } from '@angular/core';
import { ProductStatus } from 'app/utils/constants';

@Pipe({ name: 'showStatusProduct' })
export class ShowStatusProductPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case ProductStatus.STATUS_INIT:
        return '<span class="badge badge-pill badge-light-info mr-1">Chờ duyệt</span>'
      case ProductStatus.STATUS_ACTIVE:
        return '<span class="badge badge-pill badge-light-success mr-1">Đã bán</span>'
      case ProductStatus.STATUS_AVAILABLE:
        return '<span class="badge badge-pill badge-light-info mr-1">Đang bán</span>'
      case ProductStatus.STATUS_LOCKED:
        return '<span class="badge badge-pill badge-light-danger mr-1">Đang trong giỏ hàng</span>'
      case ProductStatus.LOCKED_BY_ADMIN:
        return '<span class="badge badge-pill badge-light-danger mr-1">Quản lý kho khóa</span>'
      case 30:
        return '<span class="badge badge-pill badge-light-danger mr-1">Đang khóa - Nợ cước 2G</span>'
      case ProductStatus.RETRIEVE:
        return '<span class="badge badge-pill badge-light-danger mr-1">Thu hồi</span>'
      case ProductStatus.EXPORTED:
        return '<span class="badge badge-pill badge-light-success mr-1">Đã xuất kho tổng</span>'
      case ProductStatus.CONNECTED:
        return '<span class="badge badge-pill badge-light-danger mr-1">Đã đấu nối và chưa hoàn thiện TTTB</span>'
      case ProductStatus.AWAIT_APPROVE:
        return '<span class="badge badge-pill badge-light-danger mr-1">Chờ duyệt mới khởi tạo lô nhập, Không được thao tác khác</span>'
      case ProductStatus.RETRIEVE_RENEW:
        return '<span class="badge badge-pill badge-light-danger mr-1">Thu hồi và mở bán vòng đời mới</span>'
      default:
        return value.toString();
    }
  }
}
