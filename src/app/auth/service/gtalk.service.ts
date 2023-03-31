import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class GtalkService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get all task
   */
  getAllTask(params = null) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task`, { params: params });
  }

  getAllMsisdn(params = null) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/msisdn`, { params: params });
  }

  /**
   * Xem thong tin chi tiet
   */
  getDetailTask(id) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task/${id}`);
  }

  getSummary() {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task/summary`);
  }

  exportExcelReport(dto: any): Observable<any> {
    return this._http.post(`${environment.apiGtalkUrl}/virtualnumber-admin/task/export-excel-report`, dto, { observe: 'response', responseType: 'blob' });
  }

  /**
   * Cap nhat trang thai
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  updateTaskStatus(id, data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task/${id}/update-status`, data);
  }


  sendCallback(task){
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task/${task.id}/send-callback`, {});
  }

  /**
   * Cap nhat trang thai msisdn
   * 
   * @param id 
   * @param data 
   * @returns 
   */
  updateMsisdnStatus(id, data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task/${id}/update-status-msisdn`, data);
  }

  getAvaiable() {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task/get-available`);
  }

  taskViewAgent(id) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/task/view-agent/${id}`).toPromise();
  }

  packageGetAll(params = null) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/package`, { params: params });
  }

  packageCreate(data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/package`, data);
  }

  packageUpdate(id, data) {
    return this._http.put<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/package/${id}`, data);
  }

  packageDetail(id) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/package/${id}`);
  }

  packageDelete(id) {
    return this._http.delete<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/package/${id}`);
  }

  packageUpdateStatus(data) {
    return this._http.put<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/package`, data);
  }

  productImportBatch(data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/product/import-batch`, data);
  }

  productListAll(params) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/product`, { params: params });
  }
  actionLogs(params) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/action-logs`, { params: params });
  }

  sellChannelList(params) {
    return this._http.get<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/sell-channel`, { params: params });
  }

  sellChannelCreate(data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/sell-channel`, data);
  }

  sellChannelAddUser(data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/sell-channel/add-user`, data);
  }

  sellChannelRemoveUser(data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/sell-channel/remove-user`, data);
  }

  sellChannelAddChannelToUser(data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/sell-channel/user/add-channel`, data);
  }

  sellChannelRemoveChannelFromUser(data) {
    return this._http.post<any>(`${environment.apiGtalkUrl}/virtualnumber-admin/sell-channel/user/remove-channel`, data);
  }

}
