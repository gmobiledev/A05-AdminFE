import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { CommonService } from 'app/utils/common.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { GipService } from 'app/auth/service/gip.service';

@Component({
  selector: 'app-list-merchant',
  templateUrl: './list-merchant.component.html',
  styleUrls: ['./list-merchant.component.scss']
})
export class ListMerchantComponent implements OnInit {

  public modalRef: any;
  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  
  public searchForm = {
    keyword: '',
    status: '',
    page: 1,
  }
  public selectedUser: any;


  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private commonService: CommonService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private gipService : GipService,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['gip/merchant'], { queryParams: {keyword: this.searchForm.keyword, status: this.searchForm.status}})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['gip/merchant'], { queryParams: this.searchForm})
  }

  async onSubmitLock(id, status){
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if((await this.alertService.showConfirm(confirmMessage)).value) {
      this.userService.lockUser(id, status, "").subscribe(res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

  async onCreateMerchant() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo tài khoản đại lý?")).value) {
      this.itemBlockUI.start();
      // this.userService.createMerchant(this.dataCreateMerchant).subscribe(res => {
      //   this.itemBlockUI.stop();
      //   if (!res.status) {
      //     this.alertService.showMess(res.message);
      //     return;
      //   }
  
      //   this.alertService.showSuccess(res.message);
      //   this.modalClose();
      //   this.getData();
      // }, error => {
      //   this.itemBlockUI.stop();
      //   this.alertService.showMess(error);
      //   return;
      // })
    }
  }

  modalOpen(modal, item = null) {    
    if(item) {
      this.selectedUser = item;
      this.userService.getMerchantService(item.id).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }        
  }

  modalClose() {
    this.modalRef.close();;
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách merchant',
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
            name: 'Danh sách merchant',
            isLink: false
          }
        ]
      }
    };    
  }

  getData(): void {
    this.sectionBlockUI.start();
    this.userService.getAllMerchant(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }
}
