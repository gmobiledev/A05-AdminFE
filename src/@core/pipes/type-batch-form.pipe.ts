import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'typeBatchForm'})
export class TypeBatchFormPipe implements PipeTransform {
  transform(value: any): string {
    let html = value;
    if(value == 1) {
        html = 'Nhập kho'
    } else if(value == -1) {
        html = 'Xuất kho'
    }
    return html;
  }
}