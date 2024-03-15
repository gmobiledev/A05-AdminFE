import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';
import { CreateAgentDto, CreateUserDto, UpdateStatusAgentDto } from './dto/user.dto';
import { CreateBatchExportDto, RetrieveAllSellChannelDto, RetrieveSellChannelDto, UpdateBatchExportDto } from './dto/inventory.dto';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get all batch
   */
  findBatchAll(params = null, inventoryType = "") {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/batch`, { params: params });
  }

  findBatchUser(params = null, inventoryType = "") {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/user/list`, { params: params });
  }

  findBatchStaff(params = null, inventoryType = "") {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/staff/list`, { params: params });
  }

  uploadFileBatch(data) {
    console.log("uploadFileBatch", data);
    return this._http.post<any>(`${environment.apiUrl}/admin/inventory/upload-file-batch`, data);
  }

  findChannelAll(params = null, inventoryType = "") {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/channel`, { params: params });
  }

  listSellChannelAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/channel`, { params: params });
  }

  searchSellChannelAll(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/SearchSell_Channel`, data );
  }

  lockSell(id: number, status: number){
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus`,  { id: id , status: status});
  }

  activeSell(id: number, status: number){
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus`,  { sell_channelid: id , status: status});
  }

  viewDetailSell(id: number){
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/GetSell_channelDetails`,  { id: id , status: status});
  }


  exportExcelReport(dto: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/admin/mcs/inventory/channel/exportSell_channelExcel`, dto, { observe: 'response', responseType: 'blob' });
  }

  getAllSim(params = null, inventoryType = "") {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/product`, { params: params });
  }

  uploadBatchSim(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/inventory/batch`, data);
  }

  addSellChanel(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/AddSell_Channel`, data);
  }

  updateSellChanel(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_Channel`, data);
  }

  detailBatchSim(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/batch/${id}`);
  }

  updateBatchSim(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/inventory/batch/update-status`, data);
  }

  kdCreateBatchInput(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/kinh-doanh`, data);
  }

  vpUpdateStatusBatchInput(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/van-phong/update-status`, data);
  }

  ktUpdateStatusBatchInput(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/ke-toan/update-status`, data);
  }

  dashboardHeatmap(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/GetHeatMapList`, data);
  }

  searchProductStore(params) {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/product/find-in-store`, { params: params });
  }

  getMyChannel(params) {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/my-list`, { params: params });
  }

  createBatchExport(data: CreateBatchExportDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/create`, data);
  }

  findOneBatchExport(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/find-one?batch_id=${id}`);
  }

  updateBatchExport(data: UpdateBatchExportDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/edit`, data);
  }

  ketoanDuyet(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/ke-toan/approve`, data);
  }

  vanphongDuyet(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/van-phong/approve`, data);
  }

  userDuyet(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/user/approve`, data);
  }

  ketoanReject(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/ke-toan/reject`, data);
  }

  vanPhongReject(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/van-phong/reject`, data);
  }

  userReject(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/user/reject`, data);
  }

  retrieveProductOfChannel(data: RetrieveSellChannelDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve-channel`, data);
  }

  retrieveChannel(data: RetrieveAllSellChannelDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve-all-channel`, data);
  }

  updateStatusBatchInputComplete(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/update-status-complete`, data);
  }

  getChildHeatmapStatus(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/GetDirectChildSellChannelListHeatmapByProvinceId`, data);
  }
}
