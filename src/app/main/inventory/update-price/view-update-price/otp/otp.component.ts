import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  private otp;
  
  constructor() { }

  ngOnInit(): void {
  }

  onCompletedInputOtp(code) {
    this.otp = code;  
  }

}
