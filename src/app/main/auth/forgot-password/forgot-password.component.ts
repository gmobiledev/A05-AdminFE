import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

import { CoreConfigService } from "@core/services/config.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";
import { AuthenticationService } from "app/auth/service";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ForgotPasswordComponent implements OnInit {
  // Public
  public emailVar;
  public coreConfig: any;
  public forgotPasswordForm: FormGroup;
  public submitted = false;
  timeCountdown;
  timeCountdownExpired;
  expiredTimer;
  otp;
  showReset = false;
  public passwordTextType: boolean;
  public error = "";
  noneShowSubmitOtp = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {FormBuilder} _formBuilder
   *
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private alertService: SweetAlertService,
    private _authenticationService: AuthenticationService
  ) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true,
        },
        menu: {
          hidden: true,
        },
        footer: {
          hidden: true,
        },
        customizer: false,
        enableLocalStorage: false,
      },
    };
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.noneShowSubmitOtp = false;
    if (!this.forgotPasswordForm.value.email) {
      this.alertService.showMess("Vui lòng không để trống email");
    }
    const data = {
      email: this.forgotPasswordForm.value.email,
    };
    if (this.expiredTimer) {
      clearInterval(this.expiredTimer);
    }
    this._authenticationService.forgotPassword(data).subscribe(
      (res) => {        
        if (res.status === 1 && res.data) {
          this.showReset = true;
          this.countdownExpired();
          this.countdown(1);
        } else {
          this.alertService.showMess(res.message);
        }
      },
      (err) => {
        this.alertService.showMess(err);
      }
    );
  }
  onCompletedInputOtp(code) {
    this.otp = code;
  }

  onFocusInput() {
    this.error = "";
  }

  onReset() {
    this.submitted = true;

    if (!this.forgotPasswordForm.value.email) {
      this.alertService.showMess("Vui lòng không để trống email");
    }
    if (!this.forgotPasswordForm.value.passwordNew) {
      this.alertService.showMess("Vui lòng không để trống password");
    }
    const data = {
      email: this.forgotPasswordForm.value.email,
      newPassword: this.forgotPasswordForm.value.passwordNew,
      otp: this.otp,
    };
    this._authenticationService.resetForgotPassword(data).subscribe(
      (res) => {
        if (res.status === 1 && res.data) {
          this.alertService.showMess(res.data);
          this.showReset = false;
          this._router.navigateByUrl("/auth/login");
        } else {
          this.alertService.showMess(res.message);
        }
      },
      (err) => {
        this.alertService.showMess(err);
      }
    );
  }

  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  countdown(minute) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.timeCountdown = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        clearInterval(timer);
        this.noneShowSubmitOtp = true;
      }
    }, 1000);
  }

  countdownExpired() {
    let minute = 1.5;
    let seconds: number = 90;
    let textSec: any = "0";
    let statSec: number = 30;

    const prefix = minute < 10 ? "0" : "";

    this.expiredTimer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.timeCountdownExpired = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        clearInterval(this.expiredTimer);
      }
    }, 1000);
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      passwordNew: [""],
    });

    // Subscribe to config changes
    this._coreConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.coreConfig = config;
      });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    if (this.expiredTimer) {
      clearInterval(this.expiredTimer);
    }
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
