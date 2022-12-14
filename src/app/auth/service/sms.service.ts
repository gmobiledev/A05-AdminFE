import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SmsService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAllLog(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/sms-log`, {params: params});
  }

  getAllTelco() {
    return this._http.get<any>(`${environment.apiUrl}/admin/sms-log/list-telco`);
  }
}
