import { Pipe, PipeTransform } from '@angular/core';
import { ProductStatus } from 'app/utils/constants';

@Pipe({ name: 'showStatusProduct' })
export class ShowStatusProductPipe implements PipeTransform {
  transform(value: number): string {
    switch (value) {
      case ProductStatus.STATUS_INIT:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.STATUS_ACTIVE:
        return '<span class="badge badge-pill badge-light-success mr-1">Đã bán</span>'
      case ProductStatus.STATUS_AVAILABLE:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.STATUS_LOCKED:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.LOCKED_BY_ADMIN:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case 30:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.RETRIEVE:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.EXPORTED:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.CONNECTED:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.AWAIT_APPROVE:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      case ProductStatus.RETRIEVE_RENEW:
        return '<span class="badge badge-pill badge-light-info mr-1">Chưa sử dụng</span>'
      default:
        return value.toString();
    }
  }
}
