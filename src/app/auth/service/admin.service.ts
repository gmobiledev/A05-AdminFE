import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { AddServiceAdminDto } from './dto/add-service-admin.dto';
import { AdminPushNotifyDto } from './dto/admin.dto';

@Injectable({ providedIn: 'root' })
export class AdminService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/list`, {params: params});
  }

  getOne(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/${id}`);
  } 

  lockUser(id, status, reason) {
    return this._http.post<any>(`${environment.apiUrl}/admin/admin/lock`, {user_id: id, status: status, reason: reason});
  }

  create(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin`, data);
  }

  addRole(admin, data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/role/permission/view/${admin}`, data)
  }

  removeRole(admin, data) {
    return this._http.put<any>(`${environment.apiUrl}/admin/role/permission/view/${admin}`, data)
  }

  getServiceByAdmin(admin_id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/service/${admin_id}`);
  }

  addService(admin_id, data: AddServiceAdminDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/add-service/${admin_id}`, data)
  }

  removeService(admin_id, data: AddServiceAdminDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/remove-service/${admin_id}`, data)
  }

  pushNotify(data: AdminPushNotifyDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/push-notify`, data);
  }

  saveRegId(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/save-regid`, data);
  }
}
