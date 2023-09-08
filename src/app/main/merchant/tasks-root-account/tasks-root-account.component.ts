import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskService } from 'app/auth/service/task.service';
import { CommonService } from 'app/utils/common.service';
import { ObjectLocalStorage, STORAGE_KEY } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-tasks-root-account',
  templateUrl: './tasks-root-account.component.html',
  styleUrls: ['./tasks-root-account.component.scss']
})
export class TasksRootAccountComponent implements OnInit {

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
  public file: any;
  public dataCreatePayment = {
    amount: 0
  }
  public dataApprove = {
    id: 0,
    status: 0,
    note: '',
    file: ''
  }
  
  public modalRef: any;

  constructor(
    private readonly alertService: SweetAlertService,
    private readonly taskService: TaskService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
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
    this.router.navigate(['/merchant/root-payment'], { queryParams: this.searchForm})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/merchant/root-payment'], { queryParams: this.searchForm})
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
    this.dataApprove.note = '';
   
    if (status == -1) {
      let titleS = 'Hủy bỏ';
      
      Swal.fire({
        title: titleS,
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
          this.dataApprove.note = note;
          this.taskService.approveTaskRoot(this.dataApprove).subscribe(res => {
            if (!res.status) {
              Swal.showValidationMessage(
                res.message
              )
              // this.alertService.showError(res.message);
              return;
            }
          }, error => {
            Swal.showValidationMessage(
              error
            )
          });

        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        if (result.isConfirmed) {
          this.getData();
          //this.updateStatus.emit({updated: true});
          this.alertService.showSuccess('Thành công');
        }
      })
    } else {
      let confirmMessage = "Bạn có đồng ý thực hiện thao tác?";
      if ((await this.alertService.showConfirm(confirmMessage)).value) {
        this.taskService.approveTaskRoot(this.dataApprove).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }
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
      let img = await this.commonService.resizeImage(event.target.files[0]);
      this.dataApprove.file = (img+'').replace('data:image/png;base64,', '')
    }
  }

  getData(): void {
    this.taskService.getAllTaskRoot(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
