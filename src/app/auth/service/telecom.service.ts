import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { TaskTelecom } from 'app/utils/constants';

@Injectable({ providedIn: 'root' })
export class TelecomService {

  listTaskAction = TaskTelecom.ACTION;
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

  /**
   * Get all task
   */
  getAllTaskSimCamket(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/sim-cam-ket`, { params: params });
  }

  getAllTaskWorking(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/list-working`, { params: params });
  }

  /**
   * Xem thong tin chi tiet
   */
  getDetailTask(id, action_view = null) {
    let url = action_view ? `${environment.apiTelecomUrl}/telecom-admin/task/${id}?action_view=${action_view}` : `${environment.apiTelecomUrl}/telecom-admin/task/${id}`
    return this._http.get<any>(url);
  }

    /**
   * Xem lich su thanh toan
   */
    getPaymentTask(id) {
      return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/payment-log/${id}`);
    }

    getSetting() {
      return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/setting/commitment`);
    }
    postSetting(data) {
      return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/setting/commitment`, data);
    }

  /**
 * Tìm Sim/Số
 */
  getDetailSim(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/search`, { params: params });
  }

  getDetailSimDVKH(params = null) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/dvkh/tra-cuu-kho`, { params: params });
  }
 // telecom/api/telecom-admin/msisdn/dvkh/tra-cuu-kho?keysearch=89840721099111717370
  /**
   * Xem thong tin chi tiet, có thông tin hạng số, thông tin KH 2 cũ nếu có
   */
  getDetailTaskV2(id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/detail-v2/${id}`);
  }

  /**
   * Xem thong tin chi tiet
   */
  getDetailTaskMsisdn(id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/msisdn/${id}`);
  }

  getSummary() {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/summary`);
  }

  postTopup(data, id) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/manual-topup/${id}`, data);
  }

  getHistoryTopup( id) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/${id}/topup`);
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

  updateTaskStatusV2(action, id, data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${id}/${action}/update-status`, data);
  }

  asyncToMnoViaApi(task) {
    if (task.action == this.listTaskAction.change_sim.value)
      return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${task.id}/change-sim-vnm`, {});
    else if (task.action == this.listTaskAction.new_sim.value)
      return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${task.id}/connect-vnm`, {});
    else if(task.action == this.listTaskAction.change_info)
      return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${task.id}/update-info-subsriber`, {});

  }

  

  sendCallback(task) {
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

  attachmentMsisdn(id: number, data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/${id}/attachment`, data);
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

  getMisisdnInfo(msisdn_id: number) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/${msisdn_id}`);
  }

  getCreatContract(id: number, data = null) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${id}/create-pyc`, data);
  }

  patchSignature(id: number, data) {
    return this._http.patch<any>(`${environment.apiTelecomUrl}/telecom-admin/task/${id}/update-customer-info`, data);
  }

  get2GCustomerInfo(params) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/task/2g-customer`, { params: params });
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

  conversion2GApprove(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/approve-2g-conversion`, data);
  }

  uploadSimInfo(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/upload-sim-info`, data);
  }

  submitShipTracking(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/submit-shipping-info`, data);
  }

  saveNote(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/save-note`, data);
  }

  convertCmndToCCCD(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/2g-convert-cmnd-to-cccd`, data);
  }

  searchSubscription(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/dvkh/lookup-by-id-no`, data);
  }

  assignNumberBatch(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/task/upload-msisnd-customer`, data);
  }

  getMsisdnInfo(mobile) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/TTTB/${mobile}`);
  }

  getMsisdnTopup(mobile) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/recharge/${mobile}`);
  }

  getMsisdnBalanceChanges(mobile, params) {
    return this._http.get<any>(`${environment.apiTelecomUrl}/telecom-admin/msisdn/balance-changes/${mobile}`, { params: params });
  }

  //doanh thu theo kho
  getSimReport(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/telecom-logs/simReport`, data);
  }

  getBussinessReport(data) {
    return this._http.post<any>(`${environment.apiTelecomUrl}/telecom-admin/telecom-logs/incurredChargesReport`, data);
  }
}
