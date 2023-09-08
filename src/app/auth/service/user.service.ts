import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'environments/environment';
import { User } from 'app/auth/models';
import { Observable } from 'rxjs';
import { CreateAgentDto, CreateUserDto, UpdateStatusAgentDto } from './dto/user.dto';

@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get all users
   */
  getAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users`, {params: params});
  }

  getAllMerchant(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/merchants`, {params: params});
  }

  getMerchantBalances(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/merchants/${id}/balances`);
  }

  getMerchantService(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/merchants/${id}/services`);
  }

  /**
   * Get user by id
   */
  getById(id: any) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/${id}`);
  }

  getByMobile(mobile: string) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/get-by-mobile?mobile=${mobile}`);
  }

  lockUser(id, status, reason) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/lock`, {user_id: id, status: status, reason: reason});
  }

  getListPeople(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/people`, {params: params});
  }

  getListFiles(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/list-files`, {params: params});
  }

  viewFile(id): Observable<any> {
    return this._http.get(`${environment.apiUrl}/admin/users/view-file/${id}`);
  }

  postFileExcelPeople(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/upload-excel-people`, data);
  }

  exportExcelPeople(): Observable<any> {
    return this._http.post(`${environment.apiUrl}/admin/users/export-excel-people`,{}, {observe: 'response' , responseType: 'blob'});
  }  

  exportExcelEkyc(body = {}): Observable<any> {
    return this._http.post(`${environment.apiUrl}/admin/users/download-file-excel-ekyc`,body, {observe: 'response' , responseType: 'blob'});
  }  

  listEkycBatch(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/list-ekyc-batch`, {params: params});
  } 

  checkEkyc(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/check-partner-ekyc`, data);
  }

  getAllAgents(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/agents`, {params: params});
  }

  createAgent(data: CreateAgentDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/agents`, data);
  }

  getAgentDetails(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/agents/${id}`);
  }

  getAgentServices(id) {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/agents/${id}/services`);
  }

  addServicesToAgent(id, data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/agents/${id}/services`, data);
  }

  updateStatusAgent(id, data: UpdateStatusAgentDto) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/agents/${id}/update-status`, data);
  }
    
  getAgentTypes() {
    return this._http.get<any>(`${environment.apiUrl}/admin/users/agents/list-type`);
  }

  createAgentBatch(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/agents/batch`, data);
  }

  createAgentBatchAccount(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/agents/batch-account`, data);
  }

  updateAgentInfo(id, data) {
    return this._http.put<any>(`${environment.apiUrl}/admin/users/agents/${id}`, data);
  }

  createMerchant(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/users/merchants`, data);
  }
}
