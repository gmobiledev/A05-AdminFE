import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { CommonService } from 'app/utils/common.service';
import { ObjectLocalStorage, STORAGE_KEY } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
dayjs.locale('vi')
import { TelecomService } from 'app/auth/service/telecom.service';
import { GtalkService } from 'app/auth/service/gtalk.service';


@Component({
  selector: 'app-tasks-root-account',
  templateUrl: './tasks-root-account.component.html',
  styleUrls: ['./tasks-root-account.component.scss']
})
export class TasksRootAccountComponent implements OnInit {

  @Input() service: string;

  public contentHeader: any;
  public list: any;
  public totalItems: number;
  public page: any;
  public total: any;
  public pageSize: any;
  public listCurrentAction: any;
  public listCurrentRoles: any;
  public listFiles: any;
  public selectedItem: any;
  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    trans_id: '',    
    page: 1,
    service_code: '',
    page_size: 20
  }
  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  public file: any;
  public dataCreatePayment = {
    amount: 0,
    file: '',
    file_ext: ''
  }

  public dataExcel = {
    "service_code": "AIRTIME_TOPUP",
    "is_task_account_root": true
  }

  public dataApprove = {
    id: 0,
    status: 0,
    note: ''
  }
  public balance;
  public modalRef: any;

  constructor(
    private readonly alertService: SweetAlertService,
    private readonly taskService: TaskService,
    private readonly userService: UserService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,  
    private gtalkService: GtalkService,
    private telecomService: TelecomService
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.title = params['title'] && params['title'] != undefined ? params['title'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : '';
      this.searchForm.trans_id = params['trans_id'] && params['trans_id'] != undefined ? params['trans_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      
      this.route.data.subscribe(data => {
        console.log(data);
      });
      this.getData();
    })
  }

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.listCurrentAction = user.actions;
    this.listCurrentRoles = user.roles;
    this.contentHeader = {
      headerTitle: 'Duyệt airtime tổng',
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
            name: 'Duyệt airtime tổng',
            isLink: false
          }
        ]
      }
    };    
  }

  checkAction(action) {
    return this.listCurrentAction ? this.listCurrentAction.find(item => item.includes(action)) : false
  }

  onSubmitSearch(): void {
    console.log(this.dateRange);
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate ?
      this.dateRange.startDate.toISOString().slice(0, 10) + '|' + this.dateRange.endDate.toISOString().slice(0, 10) : '';
    this.searchForm.daterange = daterangeString;
    console.log(this.searchForm);
    this.router.navigate(['/airtime/root-payment'], { queryParams: this.searchForm})
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.daterange = daterangeString;

    this.userService.exportExcelReport(this.dataExcel).subscribe(res => {
      console.log(res.body.type)
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo Airtime";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })

  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/airtime/root-payment'], { queryParams: this.searchForm})
  }

  modalOpen(modal, item = null) {    
    if(item) {
      this.selectedItem = item;
    }     
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });   
  }

  async onUpdateStatus(item, status) {
    this.dataApprove.id = item.id;
    this.dataApprove.status = status;

    if (status == -1 || status == 1) {
      let titleS = status == -1 ? 'Hủy bỏ yêu cầu' :  'Duyệt yêu cầu';
      
      Swal.fire({
        title: titleS,
        input: 'textarea',
        inputAttributes: {
          autocapitalize: 'off'
        },
        showCancelButton: true,
        confirmButtonText: 'Gửi',
        showLoaderOnConfirm: true,
        preConfirm: async (note) => {
          if (status == -1 && (!note || note == '')) {
            Swal.showValidationMessage(
              "Vui lòng nhập nội dung"
            )
            return;
          }
          this.dataApprove.note = note;
          let confirmMessage = "Bạn có đồng ý thực hiện thao tác?";
          if ((await this.alertService.showConfirm(confirmMessage)).value) {
          this.taskService.approveTaskRoot(this.dataApprove).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              // this.alertService.showError(res.message);                            
              return;
            }
            this.modalClose();
            this.getData();

          }, error => {
            Swal.showValidationMessage(
              error
            )
          })
        };

        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          this.modalClose();
          this.getData();
          //this.updateStatus.emit({updated: true});
          this.alertService.showSuccess('Thành công');
        }
      })
    }
  }

  onViewDetail(modal, item) {
    this.selectedItem = item;
    this.taskService.getFileMerchantAttach(item.id).subscribe(res => {
      if(res.status && res.data) {
        this.listFiles = res.data;
      }
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }, error => {

    })
  }

  modalClose() {
    this.modalRef.close();;
  }

  async onCreateTask() {
    if(!this.dataCreatePayment.amount) {
      return this.alertService.showMess("Vui lòng nhập đủ thông tin");
      return;
    }
    if(!this.dataCreatePayment.file) {
      this.alertService.showMess("Vui lòng đính kèm ảnh quyết định duyệt");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý thực hiện thao tác?")).value) {   
      this.taskService.createTaskRoot(this.dataCreatePayment).subscribe(res => {
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.modalClose();
        this.getData();
      }, error => {
        this.alertService.showMess(error);
        return;
      })
    }
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      const ext = event.target.files[0].type;
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.dataCreatePayment.file_ext = 'png';
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.dataCreatePayment.file = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.dataCreatePayment.file_ext = 'pdf';
        this.dataCreatePayment.file = (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '');
      }
    }
    // if (event.target.files && event.target.files[0]) {
    //   let img = await this.commonService.resizeImage(event.target.files[0]);
    //   this.dataCreatePayment.file = (img+'').replace('data:image/png;base64,', '')
    // }
  }

  getData(): void {
    this.taskService.getAllTaskRoot(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.userService.getRootMerchantBalance().subscribe(res => {
      this.balance = res.data && res.data.balance ? res.data.balance : 0
    })
  }

}
