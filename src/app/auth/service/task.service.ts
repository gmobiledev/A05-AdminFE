import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaskService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task`, {params: params});
  }

  getAllAirTime(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/airtime`, {params: params});
  }

  getAllTaskRoot(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/merchant-root`, {params: params});
  }

  createTaskRoot(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/payment/create-root`, data);
  }

  approveTaskRoot(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/payment/approve-root`, data);
  }

  getAllLoan(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/loan-bank`, {params: params});
  }

  getListCustomer(params: any = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/customer`, {params: params});
  }

  getListAdmin(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/search`, {params: params});
  }

  getById(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/loan-bank/${id}`);
  }

  updateStatus(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/update-status`, data);
  }

  getAllService() {
    return this._http.get<any>(`${environment.apiUrl}/service`);
  }

  getTransWebhook(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/${id}`);
  }

  getDetailCustomer(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/customer/${id}`);
  }

  patchUpdateCustomer(id: number, data) {
    return this._http.patch<any>(`${environment.apiUrl}/admin/customer/${id}`, data);
  }

  departmentUpdateTaskStatus(data) {
    return this._http.put<any>(`${environment.apiUrl}/admin/task/department-update-status`, data);
  }

  createTask(user_id, data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/payment/${user_id}`, data);
  }

  getFileMerchantAttach(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/${id}/get-files-merchant-attach`);
  }

  rollBackTask(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/payment/rollback`, data);
  }

  calculatePriceDiscount(data) {
    return this._http.post<any>(`${environment.apiUrl}/task/calculate-price`, data);
  }

  checkGatewayTransaction(params) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/check-transaction`, {params: params});
  }

  getTaskByServiceCode(service_code, params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/task/${service_code}`, { params: params });
  }
  
  approveTask(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/task/sim-profile/approve`, data);
  }

}
