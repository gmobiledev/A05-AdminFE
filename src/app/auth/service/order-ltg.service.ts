import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderLtgService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  findAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/order`, {params: params});
  }

  getById(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/order/${id}`);
  }

  updateStatus(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/order/update-status`, data);
  }

}
