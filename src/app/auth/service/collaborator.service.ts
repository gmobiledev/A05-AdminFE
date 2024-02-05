import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { TaskTelecom } from 'app/utils/constants';

@Injectable({ providedIn: 'root' })
export class CollaboratorService {

  /**
   *
   * @param {HttpClient} _http
   */
  constructor(private _http: HttpClient) { }

  /**
   * Get all task
   */
  getAll(params = null) {
    return this._http.get<any>(`${environment.apiUrl}/admin/collaborator`, { params: params });
  }

  create(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/collaborator`, data);
  }

  update(data, id) {
    return this._http.patch<any>(`${environment.apiUrl}/admin/collaborator/${id}`, data);
  }

  updateStatus(data, id) {
    return this._http.patch<any>(`${environment.apiUrl}/admin/collaborator/${id}/status`, data);
  }

  delete(id) {
    return this._http.delete<any>(`${environment.apiUrl}/admin/collaborator/${id}`);
  }

}
