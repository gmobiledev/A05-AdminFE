import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';

@Component({
  selector: 'app-commitment-detail',
  templateUrl: './commitment-detail.component.html',
  styleUrls: ['./commitment-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CommitmentDetailComponent implements OnInit {

  public currentUser: any;
  listCurrentAction: any;
  public list: any;
  public totalItems: number;
  public summaryTask: any;
  public data: any;
  public dataPayment: any;
  dateRange: any;
  public titleModal: string;
  public isCreate: boolean = false;
  public selectedUserId: number;
  public modalRef: any;
  public formGroup: FormGroup;


  msisdns_id: any;
  task_id: any;


  public searchForm: any = {
    mobile: '',
    action: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    page_size: 20,
    date_range: '',
    telco: '',
    customer_name: '',
    customer_type: '',
    sub_action: 'SIM_CAM_KET'
  }
  public contentHeader: any =  {
    headerTitle: 'Chi tiết thuê bao cam kết',
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
          name: 'Danh sách thuê báo cam kết',
          isLink: true,
          link: '/sim-so/commitment'
        },
        {
          name: 'Chi tiết thuê bao cam kết',
          isLink: false
        }
      ]
    }
  };

  constructor(    
    private telecomService: TelecomService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private formBuilder: FormBuilder

  ) { 

    this.route.queryParams.subscribe(params => {
      this.msisdns_id = params['msisdns_id'] && params['msisdns_id'] != undefined ? params['msisdns_id'] : '';
      this.task_id = params['task_id'] && params['task_id'] != undefined ? params['task_id'] : '';

      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
    })
  }

  ngOnInit(): void {

  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    // const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    // ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    // this.searchForm.date_range = daterangeString;
    this.telecomService.exportExcelReport(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Danh sách thuê bao cam kết";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }

  modalOpen(modal, item = null) { 
    if(item) {
      this.titleModal = "Nạp tiền cho số thuê bao";
      this.isCreate = false;
      this.selectedUserId = item.id;
      // this.userService.getAgentServices(item.id).subscribe(res => {

      //   this.currentService = res.data.map( x => { return { id: x.id, status: x.status, ref_code: x.referal_code, service_code: x.type } });
      //   let arrayControl = <FormArray>this.formGroup.controls['agents_service'];
      //   for (let i = 0; i < this.currentService.length; i++ ) {
      //     const newGroup = this.formBuilder.group({
      //       id: [{value:this.currentService[i]['id'], disabled: true}],
      //       status: [{value:this.currentService[i]['status'], disabled: true}],
      //       ref_code: [{value: this.currentService[i]['ref_code'], disabled: true}],
      //       service_code: [{value: this.currentService[i]['service_code'], disabled: true}]
      //     });
      //     const index = this.listServiceFilter.findIndex(item => item.code == this.currentService[i]['service_code']);
      //     this.listServiceFilter[index]['disabled'] = 'disabled';
      //     arrayControl.push(newGroup);
      //   }
        
      //   this.modalRef = this.modalService.open(modal, {
      //     centered: true,
      //     windowClass: 'modal modal-primary',
      //     size: 'lg'
      //   });
      // })
    } else {
      this.titleModal = "Nạp tiền cho số thuê bao";
      this.isCreate = true;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }

  modalClose() {    
    this.modalRef.close();
    this.initForm();
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      trans_id: ['', Validators.required],
      amount: ['', Validators.required],
      note: ['', Validators.required], 
      // partner_user_code: [''],
      // channel_id: [''],
    });
    this.isCreate = true;
  }

  async onSubmitCreate() {

  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    if(this.currentUser && this.currentUser.roles) {
    }
    this.telecomService.getDetailTask(this.task_id).subscribe(res => {
      this.data = res.data;
    })
    this.telecomService.getPaymentTask(this.msisdns_id).subscribe(res => {
      this.dataPayment = res.data;
    })
    this.telecomService.getSummary().subscribe(res => {
      this.summaryTask = res.data;
    })
  }

}

