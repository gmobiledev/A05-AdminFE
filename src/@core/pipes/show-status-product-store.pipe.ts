import { Pipe, PipeTransform } from '@angular/core';
import { ProductStatus, ProductStoreStatus } from 'app/utils/constants';

@Pipe({ name: 'showStatusProductStore' })
export class ShowStatusProductStorePipe implements PipeTransform {
    transform(value: number): string {
        switch (value) {
            case ProductStoreStatus.STATUS_INIT:
              return '<span class="badge badge-pill badge-light-warning mr-1">Chờ duyệt</span>'           
            case ProductStoreStatus.STATUS_AVAILABLE:
              return '<span class="badge badge-pill badge-light-info mr-1">Đã duyệt</span>'
          case ProductStoreStatus.STATUS_SOLD:
            return '<span class="badge badge-pill badge-light-success mr-1">Đã bán</span>'
            default:
              return value.toString();
          }
    }
}
