import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { takeUntil, first } from "rxjs/operators";
import { Subject } from "rxjs";

import { AuthenticationService } from "app/auth/service";
import { CoreConfigService } from "@core/services/config.service";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "app-auth-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class LoginComponent implements OnInit {
  //  Public
  public coreConfig: any;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;
  public returnUrl: string;
  public error = "";
  public passwordTextType: boolean;
  url = "";
  otp;
  showOtp = false;
  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(
    private _coreConfigService: CoreConfigService,
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    // if (this._authenticationService.currentUserValue) {
    //   this._router.navigate(['/']);
    // }

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
    return this.loginForm.controls;
  }

  /**
   * Toggle password
   */
  togglePasswordTextType() {
    this.passwordTextType = !this.passwordTextType;
  }

  onFocusInput() {
    this.error = "";
  }

  onCompletedInputOtp(code) {
    this.otp = code;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Login
    this.loading = true;
    if (this.showOtp) {
      const data = {
        username: this.f.email.value,
        password: this.f.password.value,
        otp: this.otp,
      };
      this._authenticationService
        .loginOtp(data)
        .pipe(first())
        .subscribe(
          (data) => {
            
            // console.log("===data===");
            // console.log(data);
            this._router.navigate([this.returnUrl]);
          },
          (error) => {
            console.log(error);
            this.error = error;
            this.loading = false;
          }
        );
    } else {
      this._authenticationService
        .login(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          (data) => {
            this.loading = false;
            this.showOtp = true;
          },
          (error) => {
            console.log(error);
            this.error = error;
            this.loading = false;
          }
        );
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.url = this._route.snapshot.url[0].path;
    if (this.url == "login-otp") {
      this.loginForm = this._formBuilder.group({
        mobile: ["", [Validators.required]],
        otp: ["", Validators.required],
      });
    } else {
      this.loginForm = this._formBuilder.group({
        email: ["", [Validators.required]],
        password: ["", Validators.required],
      });
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = "/inventory/sell-chanel";

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
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
