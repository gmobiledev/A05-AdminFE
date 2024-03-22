import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TelecomService } from 'app/auth/service/telecom.service';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { id } from '@swimlane/ngx-datatable';
import { CommonService } from 'app/utils/common.service';
import Swal from 'sweetalert2';
import { CreateAgentDto } from 'app/auth/service/dto/user.dto';


@Component({
  selector: 'app-view-junior-sell',
  templateUrl: './view-junior-sell.component.html',
  styleUrls: ['./view-junior-sell.component.scss']
})
export class ViewJuniorSellComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize = 10;

  public isActivedBoxNewInit: boolean = false;
  public isActivedBoxNewProcessing: boolean = false;
  public isActivedBoxUpdateInit: boolean = false;
  public isActivedBoxUpdateProcessing: boolean = false;
  public isActivedBoxChangeSimInit: boolean = false;
  public isActivedBoxChangeSimProcessing: boolean = false;

  public taskTelecomStatus;
  public selectedItem: any;
  public selectedAgent: any;
  public mineTask = false;
  public currentUser: any;
  public isAdmin: boolean = false;
  public mnos: any = []
  public listSellUser: any;

  public exitsUser: boolean = false;
  public formGroup: FormGroup;
  public isCreate: boolean = false;
  public submitted: boolean = false;
  public titleModal: string;
  public formGroupUserCode: FormGroup;
  public selectedUserId: number;
  public currentService: any;
  public listServiceFilter: any;
  public listSelectedUser = [];
  public modalUserCodeRef: any;

  public listAllService: any;
  public listServiceTmp: any;

  public listSellChannel: any;
  public isShowAddInput: boolean = true;

  public modalRef: any;
  public modalRefAdd: any;

  public searchForm = {
    id: '',
    name: '',
    code: '',
    desc: '',
    parent_id: '',
    type: '',
    status: '',
    business_id: '',
    channel_id: '',
    admin_id: '',
    province_id: '',
    district_id: '',
    skip: 0,
    commune_id: '',
    address: '',
    attach_file_name: '',
    customer_id: '',
    user_sell_channels: '',
    business: '',
    page_size: 10,
    page: 1,
    current_sell_channel_id: '',
    user_id: '',
  }

  public submittedUpload: boolean = false;
  public totalItems: number;

  @Input() provinces;
  @Input() districts;
  @Input() commues;



  @BlockUI('section-block') sectionBlockUI: NgBlockUI;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private inventoryService: InventoryService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private telecomService: TelecomService,
    private commonDataService: CommonDataService,
    private commonService: CommonService,


  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.name = params['name'] && params['name'] != undefined ? params['name'] : '';
      this.searchForm.code = params['code'] && params['code'] != undefined ? params['code'] : '';
      this.searchForm.current_sell_channel_id = params['current_sell_channel_id'] && params['current_sell_channel_id'] != undefined ? params['current_sell_channel_id'] : '';
      this.searchForm.district_id = params['district_id'] && params['district_id'] != undefined ? params['district_id'] : '';
      this.searchForm.commune_id = params['commune_id'] && params['commune_id'] != undefined ? params['commune_id'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';
      this.searchForm.province_id = params['province_id'] && params['province_id'] != undefined ? params['province_id'] : '';
      this.searchForm.page_size = params['page_size'] && params['page_size'] != undefined ? params['page_size'] : '';
      this.searchForm.user_id = params['user_id'] && params['user_id'] != undefined ? params['user_id'] : '';

      this.getData();
      this.getService();

    })
  }

  loadPage(page): void {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/view-junior-sell'], { queryParams: this.searchForm })
  }


  onSubmitSearch(): void {
    this.searchForm.page = 1;
    this.router.navigate(['/inventory/sview-junior-sell'], { queryParams: this.searchForm })
  }


  async onApprove(item, status ){
    let data = {id : item, status}
    let confirmMessage = status;
    let title = "";


    if (status == 0) {
      confirmMessage = "Bạn có khởi tạo kho?"
      title = "Bạn có đồng ý khởi tạo kho? Nhập lý do"
    } else if (status == 1) {
      confirmMessage = "Bạn có đồng ý kích hoạt kho?"
      title = "Bạn có đồng ý kích hoạt kho? Nhập lý do"
    } else if (status == -2) {
      confirmMessage = "Bạn có đồng ý khóa kho?"
      title = "Bạn có đồng ý khóa kho? Nhập lý do"
    } else if (status == -1) {
      confirmMessage = "Bạn có đồng ý hủy kho này không?"
      title = "Bạn có đồng ý hủy kho? Nhập lý do"
    }

    Swal.fire({
      title,
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Gửi',
      showLoaderOnConfirm: true,
      preConfirm: (note) => {
        if (!note || note == '') {
          Swal.showValidationMessage(
            "Vui lòng nhập nội dung"
          )
          return;
        }
        data['note'] = note;
        this.inventoryService.lockSell(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showError(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
        }, err => {
          this.alertService.showError(err);
        })  
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {

      }
    })  

  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    // const daterangeString = this.dateRange.startDate && this.dateRange.endDate
    //   ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    // this.searchForm.date_range = daterangeString;
    this.inventoryService.exportExcelReport(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo kho sim";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách kho con',
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
            name: 'Danh sách kho con',
            isLink: false
          }
        ]
      }
    };
    this.initForm();

  }

  modalOpen(modal, item = null, checkAdd = true) {
    if (item) {
      this.titleModal = "Cập nhật đại lý";
      this.isCreate = false;
      this.selectedUserId = item.id;
      this.userService.getAgentServices(item.id).subscribe(res => {

        this.currentService = res.data.map(x => { return { id: x.id, status: x.status, ref_code: x.referal_code, service_code: x.type } });
        let arrayControl = <FormArray>this.formGroup.controls['agents_service'];
        for (let i = 0; i < this.currentService.length; i++) {
          const newGroup = this.formBuilder.group({
            id: [{ value: this.currentService[i]['id'], disabled: true }],
            status: [{ value: this.currentService[i]['status'], disabled: true }],
            ref_code: [{ value: this.currentService[i]['ref_code'], disabled: true }],
            service_code: [{ value: this.currentService[i]['service_code'], disabled: true }]
          });
          const index = this.listServiceFilter.findIndex(item => item.code == this.currentService[i]['service_code']);
          this.listServiceFilter[index]['disabled'] = 'disabled';
          arrayControl.push(newGroup);
        }

        if (checkAdd == true) {
          this.modalRefAdd = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'lg'
          });
        } else {
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'lg'
          });
        }


      })
    } else {
      this.titleModal = "Thêm tài khoản bán hàng";
      this.isCreate = true;

      if (checkAdd == true) {
        this.modalRefAdd = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      } else {
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      }
    }
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }

  modalCloseAdd() {
    this.modalRefAdd.close();
    this.getData();
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      name: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      partner_user_code: [''],
      channel_id: [''],
      agents_service: this.formBuilder.array([]),
      new_agents_service: this.formBuilder.array([])
    });

    this.formGroupUserCode = this.formBuilder.group({
      partner_user_code: [''],
      channel_id: [''],
    });

    this.exitsUser = false;
    this.isCreate = true;
  }

  async onSubmitCreate() {
    console.log(this.formGroup.controls['new_agents_service'].value);
    if (!this.exitsUser && this.isCreate) {
      this.submitted = true;
      if (this.formGroup.invalid) {
        return;
      }
      const dataAgentServices = this.formGroup.controls['new_agents_service'].value.map(item => {
        return { ref_code: item.ref_code, service_code: item.service_code, partner_user_code: this.formGroup.controls['partner_user_code'].value }
      })
      const data: CreateAgentDto = {
        name: this.formGroup.controls['name'].value,
        username: this.formGroup.controls['mobile'].value,
        mobile: this.formGroup.controls['mobile'].value,
        agent_service: dataAgentServices,
        password: this.formGroup.controls['password'].value,
      }
      if ((await this.alertService.showConfirm('Bạn có đồng ý lưu dữ liệu?')).value) {
        this.userService.createAgent(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showError(res.message);
            this.submitted = false;
            return;
          }

          //add nguoi ban hang vao kho
          this.telecomService.sellChannelAddChannelToUser({
            channel_id: [this.searchForm.current_sell_channel_id],
            user_id: res.data.id
          }).subscribe(res2 => {
            if (!res2.status) {
              this.alertService.showMess(res2.message);
              return;
            }
            this.modalRef.close();
            this.initForm();
            this.alertService.showSuccess(res2.message);
            this.getData()
          }, error => {
            this.alertService.showMess(error);
            return;
          }
          )
        }, error => {
          this.alertService.showMess(error);
        })
      }
    } else {
      this.userService.addServicesToAgent(this.selectedUserId, this.formGroup.controls['new_agents_service'].value).subscribe(res => {
        if (!res.status) {
          this.alertService.showError(res.message);
          this.submitted = false;
          return;
        }
        this.modalRef.close();
        this.initForm();
        this.getData()
        this.alertService.showSuccess(res.message);
      })
    }
  }

  onChangeProvince(event) {
    let id = event.target.value
    this.commonDataService.getDistricts(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.districts = res.data
        this.commues = res.data

      }
    })
  }

  onChangeDistrict(event) {
    let id = event.target.value
    this.commonDataService.getCommunes(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.commues = res.data
      }
    })
  }

  onCheckExits() {
    if (this.formGroup.controls['mobile'].value && this.formGroup.controls['mobile'].value != '') {
      this.userService.getByMobile(this.formGroup.controls['mobile'].value).subscribe(async res => {
        this.selectedUserId = res.data.id;
        if(res.status && res.data){
          this.exitsUser = true;
          this.isCreate = false;
        }
        if (res.status && res.data && !res.data.is_agent) {
          this.titleModal = "Đặt làm đại lý";
          console.log("check isCreate = ",this.isCreate)
          this.exitsUser = true;
          return;
        } else if (res.status && res.data && res.data.is_agent) {

          this.userService.getAgentServices(res.data.id).subscribe(res => {
            this.currentService = res.data.map(x => { return { id: x.id, status: x.status, ref_code: x.referal_code, service_code: x.type } });
            let arrayControl = <FormArray>this.formGroup.controls['agents_service'];
            for (let i = 0; i < this.currentService.length; i++) {
              const newGroup = this.formBuilder.group({
                id: [{ value: this.currentService[i]['id'], disabled: true }],
                status: [{ value: this.currentService[i]['status'], disabled: true }],
                ref_code: [{ value: this.currentService[i]['ref_code'], disabled: true }],
                service_code: [{ value: this.currentService[i]['service_code'], disabled: true }]
              });
              const index = this.listServiceFilter.findIndex(item => item.code == this.currentService[i]['service_code']);
              this.listServiceFilter[index]['disabled'] = 'disabled';
              arrayControl.push(newGroup);
            }
            this.titleModal = "Cập nhật đại lý";
            this.isCreate = false;
            this.exitsUser = false;
          })
        }
        this.titleModal = this.isCreate ? "Thêm đại lý" : "Cập nhật đại lý";
      })
    }
  }

  getService() {
    this.userService.getAgentTypes().subscribe(res => {
      this.listAllService = res.data;
      this.listServiceFilter = res.data.map(x => { return { disabled: '', code: x.code, desc: x.desc } });
      this.listServiceTmp = res.data;
    })
  }

  get f() {
    return this.formGroup.controls;
  }

  addInput() {
    let arrayControl = <FormArray>this.formGroup.controls['new_agents_service'];
    let newGroup = this.formBuilder.group({
      ref_code: [],
      service_code: []
    });
    arrayControl.push(newGroup);
    if (arrayControl.length == this.listAllService.length) {
      this.isShowAddInput = false;
    }
  }

  async removeInput(index) {
    let arrayControl = <FormArray>this.formGroup.controls['new_agents_service'];
    const i = this.listSellUser.findIndex(item => item.code == this.formGroup.controls['user_id'].value[index]['channel_id']);
    if (i != -1) {
      this.listSellUser[i]['disabled'] = '';
    }
    arrayControl.removeAt(index);
    if (arrayControl.length < this.listAllService.length) {
      this.isShowAddInput = true;
    }
  }

  onCompletedInputPassword(value) {
    this.formGroup.patchValue({
      password: value
    })
  }

  getData() {

    this.commonDataService.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })


    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.page_size;
    if (this.currentUser && this.currentUser.roles) {
      const arrayRoles = this.currentUser.roles.map(item => { return item.item_name.toLowerCase() });
      if (arrayRoles.includes("admin") || arrayRoles.includes("root")) {
        this.isAdmin = true;
      }
    }
    this.sectionBlockUI.start();
    let paramSerch = { ...this.searchForm }
    for (const key in paramSerch) {
      if (paramSerch[key] == '') {
        delete paramSerch[key];
      }
    }

    this.inventoryService.searchSellChannelAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.searchForm.page_size = res.data.page_size;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
      console.log(error);
    })
  }


}

