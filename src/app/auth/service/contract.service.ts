import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ContractServive {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/contract`, {params: params});
  }

  /**
   * Get user by id
   */
  getById(id: any): Observable<any> {
    return this._http.get<any>(`${environment.apiUrl}/admin/contract/${id}`);
  }


}
