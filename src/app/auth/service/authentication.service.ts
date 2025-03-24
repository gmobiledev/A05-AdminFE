import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'environments/environment';
import { User, Role } from 'app/auth/models';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  //public
  public currentUser: Observable<User>;

  //private
  private currentUserSubject: BehaviorSubject<User>;

  /**
   *
   * @param {HttpClient} _http
   * @param {ToastrService} _toastrService
   */
  constructor(private _http: HttpClient, private _toastrService: ToastrService) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // getter: currentUserValue
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  /**
   *  Confirms if user is admin
   */
  get isAdmin() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Admin;
  }

  /**
   *  Confirms if user is client
   */
  get isClient() {
    return this.currentUser && this.currentUserSubject.value.role === Role.Client;
  }

  /**
   * User login
   *
   * @param email
   * @param password
   * @returns user
   */
  login(email: string, password: string) {
    const code = '111111';
    return this._http
      .post<any>(`${environment.apiUrl}/admin/login`, { email, password, code }, { observe: 'response' })
      .pipe(
        map(res => {
          console.log(res);
          const user = res.body.data;
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'Login thành công',
                'Welcome, ' + email + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        }, (error: HttpErrorResponse) => {
          console.log(error);          
          return error;
        })
      );
  }

  loginOtp(data) {
    return this._http
      .post<any>(`${environment.apiUrl}/admin/agent-login`, data, { observe: 'response' })
      .pipe(
        map(res => {
          console.log(res);
          const user = res.body.data;
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Display welcome toast!
            setTimeout(() => {
              this._toastrService.success(
                'Login thành công',
                'Welcome, ' + data.username + '!',
                { toastClass: 'toast ngx-toastr', closeButton: true }
              );
            }, 2500);

            // notify
            this.currentUserSubject.next(user);
          }

          return user;
        }, (error: HttpErrorResponse) => {
          console.log(error);          
          return error;
        })
      );
  }

  refreshToken() {
    const refreshToken = this.currentUserSubject.value.refreshToken;
    return this._http
      .post<any>(`${environment.apiUrl}/admin/refresh-token`, { refreshToken }, { observe: 'response' })
      .pipe(
        map(res => {
          // console.log(res);
          const user = res.body.data;
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(user));
            // notify
            this.currentUserSubject.next(user);
          }
          return user;
        }, (error: HttpErrorResponse) => {
          console.log(error);          
          return error;
        })
      );
  }

  changePassword(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/changepassword`, data)
  }

  forgotPassword(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/forgot-password`, data)
  }

  resetForgotPassword(data) {
    return this._http.post<any>(`${environment.apiUrl}/admin/forgot-password/reset`, data)
  }


  /**
   * User logout
   *
   */
  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // notify
    this.currentUserSubject.next(null);
  }
}
