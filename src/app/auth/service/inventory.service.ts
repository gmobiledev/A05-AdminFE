import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';
import { CreateAgentDto, CreateUserDto, UpdateStatusAgentDto } from './dto/user.dto';

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

  uploadFileBatch(data) {
    console.log("uploadFileBatch", data);
    return this._http.post<any>(`${environment.apiUrl}/admin/inventory/upload-file-batch`, data);
  }

  findChannelAll(params = null, inventoryType = "") {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/channel`, { params: params });
  }

  searchSellChannelAll(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/SearchSell_Channel`, data );
  }

  lockSell(id: number, status: number){
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus`,  { sell_channelid: id , status: status});
  }

  activeSell(id: number, status: number){
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus`,  { sell_channelid: id , status: status});
  }

  viewDetailSell(id: number){
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/GetSell_channelDetails`,  { sell_channelid: id , status: status});
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

}
