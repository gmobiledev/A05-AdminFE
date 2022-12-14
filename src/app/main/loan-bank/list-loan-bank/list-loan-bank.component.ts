import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractServive } from 'app/auth/service/contract.service';
import { FileServive } from 'app/auth/service/file.service';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-list-loan-bank',
  templateUrl: './list-loan-bank.component.html',
  styleUrls: ['./list-loan-bank.component.scss']
})
export class ListLoanBankComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public page: any;
  public total: any;
  public pageSize: any;
  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    is_customer_sign: '',
    is_guarantee_sign: '',
    is_bank_sign: '',
    page: 1,
  }
  public isViewFile: boolean = false;
  public urlFile: any;

  constructor(
    private taskService: TaskService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.user = params['user'] && params['user'] != undefined ? params['user'] : '';
      this.searchForm.title = params['title'] && params['title'] != undefined ? params['title'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.is_customer_sign = params['is_customer_sign'] && params['is_customer_sign'] != undefined ? params['is_customer_sign'] : '';
      this.searchForm.is_guarantee_sign = params['is_guarantee_sign'] && params['is_guarantee_sign'] != undefined ? params['is_guarantee_sign'] : '';
      this.searchForm.is_bank_sign = params['is_bank_sign'] && params['is_bank_sign'] != undefined ? params['is_bank_sign'] : '';

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/loan-bank'], { queryParams: this.searchForm})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/loan-bank'], { queryParams: this.searchForm})
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách khoản vay',
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
            name: 'Danh sách khoản vay',
            isLink: false
          }
        ]
      }
    };    
  }

  getData(): void {
    this.taskService.getAllLoan(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
