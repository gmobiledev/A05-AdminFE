import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GServiceService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  getAllService(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/services`, {params: params});
  }
  /**
   * Get all users
   */
  getDiscount(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/services/discount`, {params: params});
  }

  createDiscount(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/services/discount`, data);
  }

}
