import { Pipe, PipeTransform } from '@angular/core';
import { BatchType } from 'app/utils/constants';

@Pipe({name: 'typeBatchForm'})
export class TypeBatchFormPipe implements PipeTransform {
  transform(value: any): string {
    let html = value;
    if(value == BatchType.INPUT) {
        html = 'Nhập kho'
    } else if(value == BatchType.OUTPUT) {
        html = 'Xuất kho'
    } else if(value == BatchType.RETRIEVE) {
      html = 'Thu hồi'
  }
    return html;
  }
}