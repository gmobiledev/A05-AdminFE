import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateAgentDto } from 'app/auth/service/dto/user.dto';
import { TelecomService } from 'app/auth/service/telecom.service';
import { TelecomConst } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { stat } from 'fs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-sim-packages',
  templateUrl: './sim-packages.component.html',
  styleUrls: ['./sim-packages.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SimPackagesComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: ''
  }

  public selectedId: number;
  public currentSelectedItem: any;
  public toggleStatus: boolean;

  public isCreate: boolean = false;
  public submitted: boolean = false;  

  public modalRef: any;
  public titleModal: string;
  public formGroup: FormGroup;
  public listTelco = TelecomConst.TELCO;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  constructor(
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { 
    this.getData();
    this.getService();
  }

  modalOpen(modal, item = null) { 
    if(item) {
      this.titleModal = "Cập nhật";
      this.isCreate = false;
      this.selectedId = item.id;
      this.telecomService.packageDetail(item.id).subscribe(res => {        
        this.formGroup.patchValue({
          name: res.data.name,
          code: res.data.code,
          price: res.data.price,
          short_desc: res.data.short_desc,
          desc: res.data.desc,
          telco: res.data.telco,        
        });
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.titleModal = "Thêm mới";
      this.isCreate = true;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }

  modalClose() {    
    this.formGroup.patchValue({
      name: '',
      code: '',
      price: '',
      short_desc: '',
      desc: '',
      telco: '',        
    });
    this.modalRef.close();
    this.initForm();
  }

  onSubmitSearch(): void {

  }
  
  async updateStatusAgentService(i, status = null) {
    console.log(i);
    console.log(this.formGroup.controls['agents_service'].value[i]);
    const confirmMessage = status ? "Bạn có đồng ý mở khóa dịch vụ của đại lý?" : "Bạn có đồng ý khóa dịch vụ của đại lý?";
    const data = {
      id: this.formGroup.controls['agents_service'].value[i]['id'],
      status: status
    }

    if((await this.alertService.showConfirm(confirmMessage)).value) {
      // this.userService.updateStatusAgent(this.selectedUserId, data).subscribe(res => {
      //   if(!res.status) {
      //     this.alertService.showError(res.message);
      //     return;
      //   }        
      //   this.modalRef.close();
      //   this.initForm();
      //   this.alertService.showSuccess(res.message);
      //   this.getData();
      // }, err => {
      //   this.alertService.showError(err);
      // })
    }
  }

  async onToggleStatus(id, status) {
    console.log(id);
    console.log(status);
    const confirmMessage = status ? "Bạn có đồng ý kích hoạt gói cước?" : "Bạn có đồng ý ngừng kích hoạt gói cước?";
    if((await this.alertService.showConfirm(confirmMessage)).value) {

    } else {
      status = true;
    }
  }

  async onUpdateStatus() {
    
  }

  async onSubmitDelete(id) {
    if ((await this.alertService.showConfirm('Bạn có đồng ý xóa dữ liệu?')).value) {
      this.telecomService.packageDelete(id).subscribe(res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.getData();
        this.alertService.showSuccess(res.message);
      })
    }
  }

  /**
   * Tao tai khoan dai ly
   */
  async onSubmitCreate() {
    if (this.isCreate) {
      this.submitted = true;
      // console.log(this.formGroup.value);
      // return;
      if (this.formGroup.invalid) {
        return;
      }

      const data = {
        name: this.formGroup.controls['name'].value,
        code: this.formGroup.controls['code'].value,
        price: parseInt(this.formGroup.controls['price'].value.replace(/,/g, "")),
        short_desc: this.formGroup.controls['short_desc'].value,
        desc: this.formGroup.controls['desc'].value,
        telco: this.formGroup.controls['telco'].value,
        status: 1
      }
      
      if ((await this.alertService.showConfirm('Bạn có đồng ý lưu dữ liệu?')).value) {
        this.telecomService.packageCreate(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showError(res.message);
            this.submitted = false;
            return;
          }
          this.modalRef.close();
          this.initForm();
          this.getData();
          this.alertService.showSuccess(res.message);
        })
      }
    } else {
      const data = {
        name: this.formGroup.controls['name'].value,
        code: this.formGroup.controls['code'].value,
        price: parseInt(this.formGroup.controls['price'].value.replace(/,/g, "")),
        short_desc: this.formGroup.controls['short_desc'].value,
        desc: this.formGroup.controls['desc'].value,
        telco: this.formGroup.controls['telco'].value,

      }
      this.telecomService.packageUpdate(this.selectedId,  data).subscribe(res => {
        if (!res.status) {
          this.alertService.showError(res.message);
          this.submitted = false;
          return;
        }
        this.modalRef.close();
        this.initForm();
        this.getData();
        this.alertService.showSuccess(res.message);
      })
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách gói cước',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Danh sách gói cước',
            isLink: false
          }
        ]
      }
    };

    this.initForm();
  }

  get f() {
    return this.formGroup.controls;
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required], 
      price: ['', Validators.required], 
      short_desc: ['', Validators.required], 
      desc: ['', Validators.required], 
      telco: ['', Validators.required], 
    });
    this.isCreate = true;
  }

  getData() {
    this.sectionBlockUI.start();
    this.telecomService.packageGetAll().subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

  getService() {
    
  }

}
