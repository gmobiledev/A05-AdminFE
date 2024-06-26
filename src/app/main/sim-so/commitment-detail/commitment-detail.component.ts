import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

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
    private formBuilder: FormBuilder,
    private alertService: SweetAlertService,


  ) { 

    this.route.queryParams.subscribe(params => {
      this.msisdns_id = params['msisdns_id'] && params['msisdns_id'] != undefined ? params['msisdns_id'] : '';
      this.task_id = params['task_id'] && params['task_id'] != undefined ? params['task_id'] : '';

      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
      this.initForm();
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
      // this.selectedUserId = item.id;
      
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
      amount: [0, Validators.required],
      note: ['', Validators.required], 
    });
    this.isCreate = true;
  }

  async onSubmitCreate() {
    console.log(this.formGroup.value)
    if (this.formGroup.invalid) {
      return;
    }
    let dataPost = {
      trans_id: this.formGroup.controls['trans_id'].value,
      amount: this.formGroup.controls['amount'].value,
      note: this.formGroup.controls['note'].value,
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý thực hiện thao tác?")).value) {   
      this.telecomService.postTopup(dataPost, this.msisdns_id).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.alertService.showMess(error);
        this.modalClose();
        return;
      })
    }
   
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

