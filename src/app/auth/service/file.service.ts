import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileServive {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/files`, {params: params});
  }

  getByUserInfo(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/files/search`, {params: params});
  }

  /**
   * Get user by id
   */
  getById(id: any): Observable<any> {
    return this._http.get(`${environment.apiUrl}/files/view/${id}`, {observe: 'response' , responseType: 'blob'});
  }

  viewFiles(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/files/view-files`, data);
  }


}
