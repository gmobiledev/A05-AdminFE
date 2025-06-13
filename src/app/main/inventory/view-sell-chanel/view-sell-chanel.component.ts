import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ProductConstant, ProductStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { environment } from 'environments/environment';
import { AdminService } from 'app/auth/service/admin.service';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";
import dayjs from 'dayjs';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CreateAgentDto, CreateAgentServiceDto, CreateUserDto, UpdateStatusAgentDto } from 'app/auth/service/dto/user.dto';
import { UserService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { HttpResponse } from '@angular/common/http';
const ExcelJS = require('exceljs');


@Component({
  selector: 'app-view-sell-chanel',
  templateUrl: './view-sell-chanel.component.html',
  styleUrls: ['./view-sell-chanel.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewSellChanelComponent implements OnInit {

  public contentHeader: any = {
    headerTitle: 'Danh sách sim số',
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
          name: 'Danh sách kho',
          isLink: true,
          link: '/inventory/sell-chanel'
        },
        {
          name: 'Danh sách sim số',
          isLink: false
        }
      ]
    }
  };
  public list: any;
  public totalItems: number;
  public summaryTask: any;

  public isActivedBoxNewInit: boolean = false;
  public isActivedBoxNewProcessing: boolean = false;
  public isActivedBoxUpdateInit: boolean = false;
  public isActivedBoxUpdateProcessing: boolean = false;
  public isActivedBoxChangeSimInit: boolean = false;
  public isActivedBoxChangeSimProcessing: boolean = false;

  public listTaskAction = TaskTelecom.ACTION;
  public taskTelecomStatus;
  public taskTelecomStatusSIM;
  public selectedItem: any;
  public selectedAgent: any;


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
  public currentChannel;
  public showChannel;
  filesData;
  submittedUpload: boolean = false;
  listProductFail = [];
  listProductFailExport = [];

  public searchForm: any = {
    keysearch: '',
    action: '',
    status: '',
    mine: '',
    is_sck: false,
    is_g59: false,
    page: 1,
    array_status: [],
    skip: 0,
    take: 20,
    date_range: '',
    telco: '',
    channel_id: '',
    batch_id: '',
    keyword: '',
    level: '',
    is_kitting: '',
    is_exported: '',
    category_id: ''
  }
  isLoaded: boolean = false;

  dateRange: any;

  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public modalRef: any;
  public modalRefAdd: any;

  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private adminService: AdminService,
    private gtalkService: GtalkService,
    private authenticaionService: AuthenticationService,
    private alertService: SweetAlertService,
    private inventoryService: InventoryService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private telecomService: TelecomService,


  ) {
    this.dateRange = null;
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = [
        { value: 'used', label: 'Đã sử dụng' },
        { value: 'unused', label: 'Chưa sử dụng' }
      ];

      this.taskTelecomStatusSIM = ProductConstant.HANG_SO_THUE_BAO


      this.searchForm.keysearch = params['keysearch'] && params['keysearch'] != undefined ? params['keysearch'] : '';
      this.searchForm.status = params['status'] ? +params['status'] : '';
      this.searchForm.action = params['action'] && params['action'] != undefined ? params['action'] : '';
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.searchForm.batch_id = params['batch_id'] && params['batch_id'] != undefined ? params['batch_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';
      this.searchForm.level = params['level'] && params['level'] != undefined ? params['level'] : '';
      this.searchForm.category_id = params['category_id'] && params['category_id'] != undefined ? params['category_id'] : '';

      this.searchForm.is_sck = params['is_sck'] && params['is_sck'] != undefined ? params['is_sck'] : false;
      this.searchForm.is_g59 = params['is_g59'] && params['is_g59'] != undefined ? params['is_g59'] : false;

      if (params['is_g59'] && params['is_g59'] !== undefined && params['is_g59'] === 'false') {
        this.searchForm.is_g59 = false
      } else if (params['is_g59'] && params['is_g59'] !== undefined && params['is_g59'] === 'true') {
        this.searchForm.is_g59 = true
      }

      if (params['is_sck'] && params['is_sck'] !== undefined && params['is_sck'] === 'false') {
        this.searchForm.is_sck = false
      } else if (params['is_sck'] && params['is_sck'] !== undefined && params['is_sck'] === 'true') {
        this.searchForm.is_sck = true
      }


      this.searchForm.is_kitting = params['is_kitting'] && params['is_kitting'] != undefined ? params['is_kitting'] : '';
      this.searchForm.is_exported = params['is_exported'] && params['is_exported'] != undefined ? params['is_exported'] : '';
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
      this.contentHeader.headerTitle = 'Xem chi tiết kho số:' + this.searchForm.channel_id;

      console.log(" searchForm ==== ", this.searchForm)

      this.getData();
      this.getService();

    })

  }

  modalChannelOpen(modal, item) {
    if (item) {
      this.inventoryService.viewDetailSell(item.sub_channel_id).subscribe(res => {
        this.showChannel = res.data.items[0];

        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'sm'
        });

      })
    }
  }

  modalOpen(modal, item = null, checkAdd = true) {
    if (item) {
      this.titleModal = "Cập nhật người đấu nối";
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

      this.updateIsShowAddInput();

      })
    } else {
      this.titleModal = "Thêm tài khoản đấu nối";
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

  modalOpenNormal(modal) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  modalClose() {
    this.selectedItem = null;
    this.listProductFail = [];
    this.listProductFailExport = [];
    this.getData();
    this.modalRef.close();
    this.initForm();
    this.isShowAddInput = true;
  }

  modalCloseAdd() {
    this.modalRefAdd.close();
    this.getData();
    this.initForm();
    this.isShowAddInput = true;
  }

  addInput() {
    let arrayControl = <FormArray>this.formGroup.controls['new_agents_service'];
    let newGroup = this.formBuilder.group({
      ref_code: [],
      service_code: []
    });
    arrayControl.push(newGroup);
    this.updateIsShowAddInput()
    if (arrayControl.length == this.listAllService.length) {
      this.isShowAddInput = false;
    }
  }

  async openModalUserCode(modal, item) {
    this.selectedUserId = item.id;
    let r;
    try {
      r = await this.userService.getAgentDetails(item.id).toPromise();
      const agent = r.data.agent && r.data.agent[0] ? r.data.agent[0] : null;
      const sellChannel = r.data.sell_channel.items && r.data.sell_channel.items[0] ? r.data.sell_channel.items[0].id : null;
      this.formGroupUserCode.patchValue({
        partner_user_code: agent.partner_user_code,
        channel_id: sellChannel ? sellChannel : null
      })
      this.modalUserCodeRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    } catch (error) {

    }

  }

  modalUserCodeClose() {
    this.modalUserCodeRef.close();
    this.selectedUserId = null;
    this.initForm();
  }

  closeModalUserCode() {
    this.selectedUserId = null;
    this.modalUserCodeRef.close();
    this.initForm();
  }

  async onSubmitUpdateUserCode() {
    let data = {
      partner_user_code: this.formGroupUserCode.controls['partner_user_code'].value
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý lưu dữ liệu")).value) {
      this.userService.updateAgentInfo(this.selectedUserId, data).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        if (this.formGroupUserCode.controls['channel_id'].value) {
          this.telecomService.sellChannelAddChannelToUser({
            channel_id: [this.formGroupUserCode.controls['channel_id'].value],
            user_id: this.selectedUserId
          }).subscribe(res2 => {
            if (!res2.status) {
              this.alertService.showMess(res2.message);
              return;
            }
            this.alertService.showSuccess(res2.message);
            this.modalUserCodeClose();
          }, error => {
            this.alertService.showMess(error);
            return;
          }
          )
        } else {
          this.alertService.showSuccess(res.message);
          this.modalUserCodeClose();
        }

      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }
  }

  onCheckExits() {
    if (this.formGroup.controls['mobile'].value && this.formGroup.controls['mobile'].value != '') {
      this.userService.getByMobile(this.formGroup.controls['mobile'].value).subscribe(async res => {
        this.selectedUserId = res.data.id;
        if (res.status && res.data) {
          this.exitsUser = true;
          this.isCreate = false;
        }
        if (res.status && res.data && !res.data.is_agent) {
          this.titleModal = "Đặt làm người đấu nối";
          console.log("check isCreate = ", this.isCreate)
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
              this.updateIsShowAddInput();
            }
            this.titleModal = "Cập nhật người đấu nối";
            this.isCreate = false;
            this.exitsUser = false;
          })
        }
        this.titleModal = this.isCreate ? "Thêm người đấu nối" : "Cập nhật người đấu nối";
      })
    }
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/view-sell-chanel'], { queryParams: this.searchForm });
  }

  onSubmitSearch() {
  const allStatuses = [0, 1, 2, 3, 4, 30, 5, 6, 21, 98, 99];

  if (this.searchForm.status === 'used') {
    this.searchForm.status_array = [1];
  } else if (this.searchForm.status === 'unused') {
    this.searchForm.status_array = allStatuses.filter(s => s !== 1);
  } else {
    this.searchForm.status_array = [];
  }

    this.router.navigate(['/inventory/view-sell-chanel'], { queryParams: this.searchForm });
  }

  onFocusMobile() {
    this.exitsUser = false;
    this.titleModal = "Thêm tài khoản đấu nối";
  }
  ngOnInit(): void {
    this.initForm();
    this.isShowAddInput = true;
  }


  getData() {
    this.isLoaded = false;
    this.list = [];
    this.inventoryService.getListCustomer(this.searchForm.channel_id).subscribe(res => {
      this.sectionBlockUI.stop();
      this.listSellUser = res.data.items;

    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.inventoryService.viewDetailSell(this.searchForm.channel_id).subscribe(res => {
      this.currentChannel = res.data.items[0];
      this.contentHeader.headerTitle = 'Xem chi tiết kho số: ' + this.currentChannel.name;

    })
    this.sectionBlockUI.start();
    // this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;

    this.submitted = true;
    this.inventoryService.getAllSim(this.searchForm).subscribe(res => {
      this.isLoaded = true;
      this.list = res.data.data.items;
      this.totalItems = res.data.data.count;
      this.sectionBlockUI.stop();
      this.submitted = false;
    }, error => {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
      this.submitted = false;
    });

  }

  get f() {
    return this.formGroup.controls;
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
      });
      if (dataAgentServices.length < 1) {
        this.alertService.showMess("Vui lòng chọn Dịch vụ");
        return;
      }
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
            channel_id: [this.searchForm.channel_id],
            user_id: res.data.id
          }).subscribe(res2 => {
            if (!res2.status) {
              this.alertService.showMess(res2.message);
              return;
            }
            this.submitted = false;
            this.modalRef.close();
            this.initForm();
            this.alertService.showSuccess(res2.message);
            this.getData()
          }, error => {
            this.submitted = false;
            this.alertService.showMess(error);
            return;
          }
          )
        }, error => {
          this.submitted = false;
          this.alertService.showMess(error);
        })
      }
    } else {
      // this.userService.addServicesToAgent(this.selectedUserId, this.formGroup.controls['new_agents_service'].value).subscribe(res => {
      //   if (!res.status) {
      //     this.alertService.showError(res.message);
      //     this.submitted = false;
      //     return;
      //   }                        
      // })

      if ((await this.alertService.showConfirm('Bạn có đồng ý lưu dữ liệu?')).value) {
        //add nguoi ban hang vao kho
        this.telecomService.sellChannelAddChannelToUser({
          channel_id: [this.searchForm.channel_id],
          user_id: this.selectedUserId
        }).subscribe(res2 => {
          if (!res2.status) {
            this.alertService.showMess(res2.message);
            return;
          }
          this.modalRef.close();
          this.initForm();
          this.isShowAddInput = true;
          this.alertService.showSuccess(res2.message);
          this.getData()
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }

    }
  }

  getService() {
    this.userService.getAgentTypes().subscribe(res => {
      this.listAllService = res.data;
      this.listServiceFilter = res.data.map(x => { return { disabled: '', code: x.code, desc: x.desc } });
      this.listServiceTmp = res.data;
    })
  }

  getSellChannel() {
    this.telecomService.sellChannelList(null).subscribe(res => {
      this.listSellChannel = res.data.items;
    })
  }

  async onFileChangeExcel(event) {
    this.filesData = event.target.files[0];
  }

  /**
   * KITTING
   * 
   */
  async onSubmitUpload() {
    if (!this.filesData) {
      this.alertService.showMess("Vui lòng chọn file");
      return;
    }
    if (await (this.alertService.showConfirm("Bạn có đồng ý lưu lại?"))) {
      this.submittedUpload = true;
      this.itemBlockUI.start();
      let formData = new FormData();
      formData.append("files", this.filesData);
      formData.append("channel_id", this.searchForm.channel_id);
      this.inventoryService.kittingProduct(formData).subscribe(res => {
        this.submittedUpload = false;
        this.itemBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }

        if (res.data.product_update_fail.length < 1) {
          this.alertService.showSuccess(res.message, 4500);
          this.modalClose();
        } else {
          this.listProductFail = res.data.product_update_fail;
          this.listProductFailExport = res.data.product_update_fail.map(x => { return { msisdn: " '" + x.msisdn, serial: " '" + x.serial } });
        }

        this.alertService.showSuccess(res.data.message, 4500);

      }, error => {
        this.submittedUpload = false;
        this.itemBlockUI.stop();
        this.alertService.showMess(error);
      })
    }

  }

  async onExportExcel() {

    this.sectionBlockUI.start();
    this.inventoryService.exportExcelChannelProducts(this.searchForm).subscribe((res: HttpResponse<Blob>) => {
      console.log(res);
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = `Danhsachsokho_${this.currentChannel.code}`;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      this.sectionBlockUI.stop();
    })

  }

  async exportExcelByLocal() {
    this.sectionBlockUI.start();
    this.inventoryService.getAllChannelProducts(this.searchForm).subscribe(async res => {
      let data: any = res.data.items;
      data.forEach(element => {
        element['short_desc'] = element['short_desc'] ? "'" + element['short_desc'] : '';
        element['level'] = element['level'] ? element['level'] : '';
        element['price'] = element['price'] ? element['price'] : '';
        element['export_date'] = element['export_date'] ? element['export_date'] : '';
        // delete element['sell_channels']
      })
      await this.downloadFile(data, 'jsontocsv')
      this.sectionBlockUI.stop();
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
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
    this.isShowAddInput = true;
  }

  onCompletedInputPassword(value) {
    this.formGroup.patchValue({
      password: value
    })
  }

  async onRemoveItem(item) {
    if ((await this.alertService.showConfirm("Bạn có đồng ý xoá tài khoản đấu nối này không?")).value) {
      this.inventoryService.removeUserChanel(this.searchForm.channel_id, item.id).subscribe(res => {
        this.sectionBlockUI.stop();
        this.listSellUser = res.data.items;
        this.getData()
        console.log(item)
      }, error => {
        this.sectionBlockUI.stop();
        console.log("ERRRR");
        console.log(error);
      })
    }
  }


  removeInput(index: number) {
    const arrayControl = this.formGroup.get('new_agents_service') as FormArray;
    const group = arrayControl.at(index) as FormGroup;

    group.patchValue({
      ref_code: '',
      service_code: ''
    });

    this.updateIsShowAddInput();
  }


  downloadFile(data, filename = 'data') {
    // console.log("downloadFile",data)
    let nearest_channel;
    if (data[0]?.sell_channels && data[0]?.sell_channels[0]?.nearest_channel?.name) {
      nearest_channel = 'nearest_channel_name';
      data.map(x => x.nearest_channel_id = x?.sell_channels[0]?.nearest_channel?.name)
    } else {
      nearest_channel = 'nearest_channel_id';
      data.map(x => x.nearest_channel_id = x?.sell_channels[0]?.nearest_channel_id)
    }
    let csvData = this.ConvertToCSV(data, ['name', 'short_desc', 'brand', 'level', 'category_id', 'is_kit', 'price', nearest_channel, 'status', 'created_at', 'export_date']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        if (head == "nearest_channel_name") {
          let nearest_channel = array[i]["sell_channels"][0];
          nearest_channel = nearest_channel['nearest_channel'] ? nearest_channel['nearest_channel']['name'] : null
          line += "," + nearest_channel
        } else {
          line += ',' + array[i][head];
        }
      }
      str += line + '\r\n';
    }
    return str;
  }

  updateIsShowAddInput() {
    const arrayControl = this.formGroup.get('new_agents_service') as FormArray;
    this.isShowAddInput = arrayControl.length < this.listAllService.length;
  }

  onResetCheck() {
  this.exitsUser = false;
  this.isCreate = true;
  this.titleModal = 'Thêm tài khoản đấu nối';
  this.formGroup.get('mobile').enable(); // Cho nhập lại số
  this.formGroup.get('mobile').reset();
  
  const agentsService = this.formGroup.get('agents_service') as FormArray;
  agentsService.clear();
  this.updateIsShowAddInput();
}

}

