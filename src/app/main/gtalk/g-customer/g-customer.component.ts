import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'app/auth/service';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-g-customer',
  templateUrl: './g-customer.component.html',
  styleUrls: ['./g-customer.component.scss']
})
export class GCustomerComponent implements OnInit {

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

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private gtalkService: GtalkService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/gtalk/customer'], { queryParams: {keyword: this.searchForm.keyword, status: this.searchForm.status}})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gtalk/customer'], { queryParams: this.searchForm})
  }

  async onSubmitLock(id, status){
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if((await this.alertService.showConfirm(confirmMessage)).value) {
      this.gtalkService.lockUser(id, status, "").subscribe(res => {
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

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách user',
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
            name: 'Danh sách user',
            isLink: false
          }
        ]
      }
    };    
  }

  countMsisdn(items, state) {
    const list = items.filter(item => item.state == state);
    return list ? list.length : 0;
  }

  getData(): void {
    this.sectionBlockUI.start();
    this.gtalkService.getAllCustomer(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

}
