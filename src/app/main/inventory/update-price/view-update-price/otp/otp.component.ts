import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { TelecomService } from "app/auth/service/telecom.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";

@Component({
  selector: "app-otp",
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit {
  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() idTask: any;
  private otp;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService
  ) {}

  ngOnInit(): void {}

  onCompletedInputOtp(code) {
    this.otp = code;
  }

  submit(name: string) {
    if (name === "approve") {
      this.telecomService
        .postVerifyOtp({
          batch_id: this.idTask,
          otp: this.otp,
        })
        .subscribe(
          (res) => {
            if (res.status == 1) {
              this.alertService.showMess(res.message);
              this.closeModal.next(true);
            }
          },
          (err) => {
            this.alertService.showMess(err);
          }
        );
    } else {
      this.closeModal.next(false); // đóng modal otp
    }
  }
}
