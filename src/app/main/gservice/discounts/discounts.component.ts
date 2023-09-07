import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GServiceService } from 'app/auth/service/gservice.service';
import { TaskService } from 'app/auth/service/task.service';
import { ObjectLocalStorage, STORAGE_KEY } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-discounts',
  templateUrl: './discounts.component.html',
  styleUrls: ['./discounts.component.scss']
})
export class DiscountsComponent implements OnInit {

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

  public dataCreate = {
    name: '',
    services: [],
    date_range: '',
    start_money: 0,
    end_money: 0,
    value: 0
  }
  
  public task;
  public trans;
  public wh;

  public modalRef: any;

  constructor(
    private readonly alertService: SweetAlertService,
    private readonly taskService: TaskService,
    private readonly gServiceService: GServiceService,
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
      headerTitle: 'Chương trình chiết khấu',
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
            name: 'Chương trình chiết khấu',
            isLink: false
          }
        ]
      }
    };    
  }

  checkAction(action) {
    return this.listCurrentRoles.find(item => item.item_name.includes(action))
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

  async onCreate() {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo đơn hàng này không?")).value) {      
      this.gServiceService.createDiscount(this.dataCreate).subscribe(res => {
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

  getData(): void {
    this.gServiceService.getDiscount(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
