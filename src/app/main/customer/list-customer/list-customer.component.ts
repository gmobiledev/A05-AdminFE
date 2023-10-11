import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractServive } from 'app/auth/service/contract.service';
import { FileServive } from 'app/auth/service/file.service';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-customer',
  templateUrl: './list-customer.component.html',
  styleUrls: ['./list-customer.component.scss']
})

export class ListCustomerComponent implements OnInit {

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  public modalRef: any;
  public selectedItem: any;
  public contentHeader: any;
  public data: any;

  public list: any;
  public page: any;
  public total: any;
  public pageSize: any = 20;
  public searchForm = {
    mobile: '',
    id_no: '',
    name: '',
    page: 1,
  }
  public isViewFile: boolean = false;
  public urlFile: any;

  constructor(
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
      this.searchForm.id_no = params['id_no'] && params['id_no'] != undefined ? params['id_no'] : '';
      this.searchForm.name = params['name'] && params['name'] != undefined ? params['name'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;      

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/customer/list'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/customer/list'], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách khách hàng',
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
            name: 'Danh sách khách hàng',
            isLink: false
          }
        ]
      }
    };
  }

  getData(): void {
    this.taskService.getListCustomer(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

  async modalOpen(modal, item = null) {
    this.itemBlockUI.start();
    this.selectedItem = item;

    this.itemBlockUI.stop();
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  onViewDetail(modal, item) {
    this.selectedItem = item;
    this.taskService.getDetailCustomer(item.id).subscribe(res => {
      if (res.status && res.data) {
        this.data = res.data;
      }
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'xl'
      });
    })
  }

  modalClose() {
    this.selectedItem = null;
    this.getData();
    this.modalRef.close();
  }


}

