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

  findSellChannelAll(params = null, inventoryType = "") {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/SearchSell_Channel`, { params: params });
  }

  lockSell(id: number, status: number, note: string){
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus`);
  }

  activeSell(id: number, status: number, note: string){
    return this._http.get<any>(`${environment.apiUrl}/admin/mcs/inventory/channel/UpdateSell_ChannelStatus
    `);
  }

  exportExcelReport(dto: any): Observable<any> {
    return this._http.post(`${environment.apiUrl}/admin/mcs/inventory/channel/ExportSell_channelList`, dto, { observe: 'response', responseType: 'blob' });
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
