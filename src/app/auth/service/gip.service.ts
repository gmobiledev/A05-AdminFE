import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GipService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  getAllGip(params = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/gip-admin/msisdn`, { params: params });
  }

  getCallHistory(params: any = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/gip-admin/msisdn/cdrs`, { params: params });
  }

  exportData(data) {
    return this._http.post<any>(`${environment.apiGipUrl}/gip-admin/msisdn/export-excel`, data);
  }

  getPackage(params = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/gip-admin/package`, { params: params });
  }

  getReport(params = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/gip-admin/report/ocs`, { params: params });
  }

  getTasks(params = null) {
    return this._http.get<any>(`${environment.apiGipUrl}/gip-admin/task`, { params: params });
  }

  addTask(data) {
    return this._http.post<any>(`${environment.apiGipUrl}/gip-admin/task`, data);
  }

  registerPackage(data) {
    return this._http.post<any>(`${environment.apiGipUrl}/gip-admin/task/register/package`, data);
  }


  enableGip(data) {
    return this._http.post<any>(`${environment.apiGipUrl}/gip-admin/task/enable-gip`, data);
  }


  lockGip(data) {
    return this._http.post<any>(`${environment.apiGipUrl}/gip-admin/task/state/merchant`, data);
  }

  lockTask(data) {
    return this._http.patch<any>(`${environment.apiGipUrl}/gip-admin/task/set-state-msisdn/{slug}`, data);
  }

  terminateMsisdn(data) {
    return this._http.patch<any>(`${environment.apiGipUrl}/gip-admin/task/terminate-msisdn/{slug}`, data);
  }


}
