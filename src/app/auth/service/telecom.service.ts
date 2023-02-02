import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class TelecomService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get all task
   */
  getAllTask(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task`, { params: params });
  }

  getAllTaskWorking(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/list-working`, { params: params });
  }

  /**
   * Xem thong tin chi tiet
   */
  getDetailTask(id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${id}`);
  }

  getSummary() {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/summary`);
  }

  exportExcelReport(dto: any): Observable<any> {
    return this._http.post(`${environment.apiTelecomUrl}/telecom-admin/task/export-excel-report`, dto, { observe: 'response', responseType: 'blob' });
  }
  /**
   * 
   * Check xem task co kha dung de thuc hien
   * @param id 
   * @returns 
   */
  checkAvailabledTask(id) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${id}/check-available`, {}).toPromise();
  }

  /**
   * Cap nhat trang thai
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  updateTaskStatus(id, data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${id}/update-status`, data);
  }

  asyncToMnoViaApi(task) {
    if (task.action == "change_info")
      return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${task.id}/change-sim-vnm`, {});
    else if (task.action == "new_sim")
      return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${task.id}/connect-vnm`, {});
  }

  /**
   * Cap nhat trang thai msisdn
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  updateMsisdnStatus(id, data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${id}/update-status-msisdn`, data);
  }

  getAvaiable() {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/get-available`);
  }

  taskViewAgent(id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/view-agent/${id}`).toPromise();
  }

  packageGetAll(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/package`, { params: params });
  }

  packageCreate(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/package`, data);
  }

  packageUpdate(id, data) {
    return this._http.put<any>(`${environment.apiTelecomUrl}/telecom-admin/package/${id}`, data);
  }

  packageDetail(id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/package/${id}`);
  }

  packageDelete(id) {
    return this._http.delete<any>(`${environment.apiTelecomUrl}/telecom-admin/package/${id}`);
  }

  packageUpdateStatus(data) {
    return this._http.put<any>(`${environment.apiTelecomUrl}/telecom-admin/package`, data);
  }

  productImportBatch(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/product/import-batch`, data);
  }

  productListAll(params) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/product`, { params: params });
  }

}
