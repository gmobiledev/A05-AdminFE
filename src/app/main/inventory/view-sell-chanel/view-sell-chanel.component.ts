import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from 'app/auth/service';
import { ProductStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
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

@Component({
  selector: 'app-view-sell-chanel',
  templateUrl: './view-sell-chanel.component.html',
  styleUrls: ['./view-sell-chanel.component.scss']
})
export class ViewSellChanelComponent implements OnInit {

  public contentHeader: any = {
    headerTitle: 'Yêu cầu của đại lý',
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
          name: 'Yêu cầu của đại lý',
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

  public searchForm: any = {
    keysearch: '',
    action: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    skip: 0,
    take: 20,
    date_range: '',
    telco: '',
    channel_id: '',
    batch_id: '',
    keyword: '',
    ekyc_status: '',
    level: ''
  }

  dateRange: any;

  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public modalRef: any;

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
      this.taskTelecomStatus = Object.keys(ProductStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
        obj[key] = ProductStatus[key];
        return obj;
      }, {});

      this.searchForm.keysearch = params['keysearch'] && params['keysearch'] != undefined ? params['keysearch'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.action = params['action'] && params['action'] != undefined ? params['action'] : '';
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.searchForm.batch_id = params['batch_id'] && params['batch_id'] != undefined ? params['batch_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.ekyc_status = params['ekyc_status'] != undefined ? params['ekyc_status'] : '_all';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;

      this.contentHeader.headerTitle = 'Xem chi tiết kho số';
      this.contentHeader.breadcrumb.links[1] = 'Xem chi tiết kho số';

      // this.getData();
      this.getService();
      // this.getSellChannel();

    })

  }

  modalOpen(modal, item = null) {
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

        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.titleModal = "Thêm tài khoản bán hàng";
      this.isCreate = true;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }

  modalClose1() {
    this.modalRef.close();
    this.initForm();
  }

  addInput() {
    let arrayControl = <FormArray>this.formGroup.controls['new_agents_service'];
    let newGroup = this.formBuilder.group({
      ref_code: [],
      service_code: []
    });
    arrayControl.push(newGroup);
    if(arrayControl.length == this.listAllService.length) {
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
        if (res.status && res.data && !res.data.is_agent) {
          this.titleModal = "Đặt làm đại lý";
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
        this.exitsUser = false;
      })
    }
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/view-sell-chanel'], { queryParams: this.searchForm });
  }

  showDate(date, timeZone, diff) {
    if (!date) {
      return '';
    }
    let dateConverted = new Date(date);
    dateConverted.setMinutes(new Date(date).getMinutes() + diff);
    return formatDate(dateConverted, 'dd/MM/yyyy H:mm', 'en-US', timeZone);
  }

  onSubmitSearch() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;
    this.searchForm.mine = this.mineTask ? 1 : '';
    this.router.navigate(['/inventory/view-sell-chanel'], { queryParams: this.searchForm });
  }

  onFocusMobile() {
    this.exitsUser = false;
    this.titleModal = "Thêm tài khoản bán hàng";
  }
  ngOnInit(): void {
    this.getData()
    this.initForm();
  }


  getData() {
    this.inventoryService.getListCustomer(this.searchForm.channel_id).subscribe(res => {
      this.sectionBlockUI.stop();
      this.listSellUser = res.data.items;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.sectionBlockUI.start();
    this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
    this.inventoryService.getAllSim(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.data.items;
      this.totalItems = res.data.data.count;
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
            channel_id: [this.searchForm.channel_id],
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
        this.alertService.showSuccess(res.message);
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

  getSellChannel() {
    this.telecomService.sellChannelList(null).subscribe(res => {
      this.listSellChannel = res.data.items;
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
  }

  onCompletedInputPassword(value) {
    this.formGroup.patchValue({
      password: value
    })
  }

  async onRemoveItem(item) {
    if ((await this.alertService.showConfirm("Bạn có đồng ý xoá tài khoản bán hàng này không?")).value) {
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


  async removeInput(index) {
    let arrayControl = <FormArray>this.formGroup.controls['new_agents_service'];
    const i = this.listSellUser.findIndex(item => item.code == this.formGroup.controls['user_id'].value[index]['channel_id']);
    if(i != -1) {
      this.listSellUser[i]['disabled'] = '';
    }    
    arrayControl.removeAt(index);
    if(arrayControl.length < this.listAllService.length) {
      this.isShowAddInput = true;
    }
  }

}

