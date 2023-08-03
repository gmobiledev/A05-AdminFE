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

  /**
   * Xem thong tin chi tiet, có thông tin hạng số, thông tin KH 2 cũ nếu có
   */
  getDetailTaskV2(id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/detail-v2/${id}`);
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

  sendCallback(task){
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${task.id}/send-callback`, {});
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

  approveSubcriberInfo(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/approve-subcriber-info`, data);
  }

  approveMsisdnLevel(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/approve-msisdn-level`, data);
  }

  uploadOldIdenficationDocs(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/upload-old-indetification-docs`, data);
  }

  ////

  productImportBatch(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/product/import-batch`, data);
  }

  productListAll(params) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/product`, { params: params });
  }
  actionLogs(params) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/action-logs`, { params: params });
  }

  sellChannelList(params) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/sell-channel`, { params: params });
  }

  sellChannelCreate(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/sell-channel`, data);
  }

  sellChannelAddUser(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/sell-channel/add-user`, data);
  }

  sellChannelRemoveUser(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/sell-channel/remove-user`, data);
  }

  sellChannelAddChannelToUser(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/sell-channel/user/add-channel`, data);
  }

  sellChannelRemoveChannelFromUser(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/sell-channel/user/remove-channel`, data);
  }

  getAllMsisdn(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn`, { params: params });
  }

  getMisisdnInfo(msisdn_id: number){
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/${msisdn_id}`);
  }
  get2GCustomerInfo(params){
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/2g-customer`, {params: params});
  }

  requestPayDebit(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/request-pay-debit`, data);
  }

  confirmPayDebit(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/confirm-pay-debit`, data);
  }

  uploadOganizationContract(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/upload-oganization-contract`, data);
  }

}
