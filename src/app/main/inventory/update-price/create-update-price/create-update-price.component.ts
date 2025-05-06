import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TelecomService } from "app/auth/service/telecom.service";
import { SweetAlertService } from "app/utils/sweet-alert.service";

@Component({
  selector: "app-create-update-price",
  templateUrl: "./create-update-price.component.html",
  styleUrls: ["./create-update-price.component.scss"],
})
export class CreateUpdatePriceComponent implements OnInit {
  @Output() closePopup = new EventEmitter<boolean>();
  formCreatePrice;
  file;
  attachments;

  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.formCreatePrice = this.formBuilder.group({
      name: ["", Validators.required],
      code: ["", Validators.required],
      nameproduct: ["", Validators.required],
      quantity: ["", Validators.required],
      note: ["", Validators.required],
    });
  }

  onFileSelected(event: Event, name: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files[0] && input.files[0].size > 0) {
      let file = input.files[0];
      if (name == "document") {
        this.attachments = null;
        this.attachments = file;
        console.log('attachments', this.attachments);
        
      } else {
        this.file = null;
        this.file = file;
        console.log('file', this.file);
      }
    }
  }

  onSubmitCreate() {
    if (!this.formCreatePrice.value.name) {
      this.alertService.showMess("Vui lòng không để trống tiêu đề!");
      return;
    }
    if (!this.formCreatePrice.value.code) {
      this.alertService.showMess("Vui lòng không để trống mã phiếu!");
      return;
    }
    if (!this.formCreatePrice.value.nameproduct) {
      this.alertService.showMess("Vui lòng không để trống tên hàng!");
      return;
    }
    if (!this.formCreatePrice.value.quantity) {
      this.alertService.showMess("Vui lòng không để trống số lượng!");
      return;
    }
    if (!this.attachments) {
      this.alertService.showMess("Vui lòng không để trống Văn bản phê duyệt của Lãnh đạo!");
      return;
    }
    if (!this.file) {
      this.alertService.showMess(
        "Vui lòng không để trống file excel danh sách!"
      );
      return;
    }
    const formData: FormData = new FormData();
    formData.append('quantity', this.formCreatePrice.value.quantity);
    formData.append('receipt_code', this.formCreatePrice.value.code);
    formData.append('name', this.formCreatePrice.value.nameproduct);
    formData.append('channel_id', '1');
    formData.append('title', this.formCreatePrice.value.name);
    formData.append('attachments', this.attachments);
    formData.append('files', this.file);
    formData.append('note', this.formCreatePrice.value.note);

      console.log('data', formData);
      this.telecomService.postUpdatePriceBatch(formData).subscribe((res: any) => {
        if(res.status == 1){
          this.alertService.showMess(res.message);
          this.closePopup.next();
        } else{
          this.alertService.showMess(res.message); 
        }
      },(err) => {
        this.alertService.showMess(err);
      });
  }
}
