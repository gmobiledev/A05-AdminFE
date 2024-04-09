import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';
import { CreateAgentDto, CreateUserDto, UpdateStatusAgentDto } from './dto/user.dto';
import { CreateBatchExportDto, CreateBatchRetrieveDto, RetrieveAllSellChannelDto, RetrieveSellChannelDto, UpdateBatchDto, UpdateBatchExportDto, UpdateStatusProductDto } from './dto/inventory.dto';

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
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/SearchSell_Channel`, data);
  }

  lockSell(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus`, data);
  }

  getListCustomer(channel_id: number) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/FindUserBySellChannelId`, { channel_id: channel_id });
  }

  removeUserChanel(channel_id, user_id) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/DeleteUserBySellChannelIDAndUserId`, { user_id: user_id, channel_id: channel_id });
  }


  activeSell(id: number, status: number) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus`, { sell_channelid: id, status: status });
  }

  viewDetailSell(id: number) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/GetSell_channelDetails`, { id: id, status: status });
  }


  exportExcelReport(dto: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/admin/mcs/inventory/channel/exportSell_channelExcel`, dto, { observe: 'response', responseType: 'blob' });
  }

  getAllSim(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/product`, { params: params });
  }

  getAllSimSO(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/SearchProductStore`, data);
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

  createBatchExport(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/create`, data);
  }

  findOneBatchExport(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/find-one?batch_id=${id}`);
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

  summaryReport(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/sell-channel/s99SummarizeReports`, data);
  }

  viewFile(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/common/file/get-file`, data);
  }

  createBatchRetrieve(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/create`, data);
  }

  updateBatchRetrieve(data: UpdateBatchDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/edit`, data);
  }

  ketoanApproveBatchRetrieve(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/ke-toan/approve`, data);
  }

  ketoanRejectBatchRetrieve(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/ke-toan/reject`, data);
  }

  vanphongApproveBatchRetrieve(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/van-phong/approve`, data);
  }

  vanphongRejectBatchRetrieve(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/van-phong/reject`, data);
  }

  userApproveBatchRetrieve(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/user/approve`, data);
  }

  userRejectBatchRetrieve(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/retrieve/user/reject`, data);
  }

  checkProductStore(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/check-upload-excel-file`, data);
  }

  createBatchInputV2(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch`, data);
  }

  getProductFromChild(params) {
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/product/find-from-child`, {params: params});
  }

  updatePriceProduct(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/sell-channel/price/update`, data);
  }

  searchExcelProductExport(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/product/search-product-from-excel`, data);
  }

  updateStatusProduct(data: UpdateStatusProductDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/product/update-status`, data);
  }

  updateProductPriceBatch(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/sell-channel/price/update-batch`, data);
  }

  kittingProduct(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/product/kitting`, data);
  }
}
