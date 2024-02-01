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




}
