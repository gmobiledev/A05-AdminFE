import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'typeBalanceChange'})
export class TypeBalanceChangesPipe implements PipeTransform {
  transform(value: any): string {
    let html = value;
    if(value == 'CREATE') {
        html = 'Tạo tài khoản'
    } else if(value == 'TOPUP') {
        html = 'Nạp tiền'
    } else if(value == 'SET RP') {
        html = 'Mua gói cước'
    } else if(value == 'RENEW RP') {
        html = 'Gia hạn gói cước'
    } else if(value == 'PURCHASE') {
        html = 'PURCHASE'
    } else if(value == 'LOCK_1_WAY') {
        html = 'Khóa 1 chiều'
    } else if(value == 'LOCK_2_WAY') {
        html = 'Khóa 2 chiều'
    } else if(value == 'RETRIEVE') {
        html = 'Thu hồi'
    } 
    return html;
  }
}