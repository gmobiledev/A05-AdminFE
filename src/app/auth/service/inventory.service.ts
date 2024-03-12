import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';
import { CreateAgentDto, CreateUserDto, UpdateStatusAgentDto } from './dto/user.dto';
import { CreateBatchExportDto, UpdateBatchExportDto } from './dto/inventory.dto';

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


  getAllSim(params = null, inventoryType = "") {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/product`, { params: params });
  }

  uploadBatchSim(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/inventory/batch`, data);
  }

  detailBatchSim(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/inventory/batch/${id}`);
  }

  updateBatchSim(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/inventory/batch/update-status`, data);
  }

  kdCreateBatch(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/kinh-doanh`, data);
  }

  vpUpdateStatusBatch(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/van-phong/update-status`, data);
  }

  ktUpdateStatusBatch(data) {
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

  updateBatchExport(data: UpdateBatchExportDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/edit`, data);
  }

  ketoanDuyet(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/ke-toan/approve`, data);
  }

  vanphongDuyet(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/mcs/inventory/batch/export/van-phong/approve`, data);
  }

}
