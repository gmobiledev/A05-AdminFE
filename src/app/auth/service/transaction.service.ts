import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionServivce {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/transaction`, {params: params});
  }

  /**
   * Get user by id
   */
  getAllTransType() {
    return this._http.get<any>(`${environment.apiUrl}/admin/transaction/trans-type`);
  }

  getMoneyIn(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/transaction/merchant-root`, {params: params});
  }

  exportExcel(dto = null) {
    return this._http.post<any>(`${environment.apiUrl}/admin/transaction/export-excel`,dto);
  }


}
