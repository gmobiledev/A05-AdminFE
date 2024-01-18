import { CoreConfigService } from '@core/services/config.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';
import { DatePipe } from '@angular/common';
import { UserService } from 'app/auth/service';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ObjectLocalStorage } from 'app/utils/constants';
import Swal from 'sweetalert2';
import { GipService } from 'app/auth/service/gip.service';
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-call-history',
  templateUrl: './call-history.component.html',
  styleUrls: ['./call-history.component.scss']
})

export class CallHistoryComponent implements OnInit {

  @BlockUI('item-block') itemBlockUI: NgBlockUI;

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  
  public currentUser;
  dateRange: any;

  public searchForm = {
    status: '',
    page: 1,
    take: 10,
    skip: 0,
    service_code: '',
    date_range: '',
    topup: ''

  }


  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gipServer: GipService

  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.take = params['take'] && params['take'] != undefined ? params['take'] : 10;
      this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.take;
      this.searchForm.service_code = params['service_code'] && params['service_code'] != undefined ? params['service_code'] : 'AIRTIME_TOPUP';
      this.searchForm.date_range = params['date_range'] && params['date_range'] != undefined ? params['date_range'] : '';

      this.getData();
    })
  }


  public dataCall = {
    merchant_id: 1050,
    msisdn: '0598282048',
    start_date: '2023-11-01',
    end_date: '2023-11-30',
    page_size: 10,
    page: 1,
    type: 'call'
  };

  getData(): void {
    this.gipServer.getCallHistory(this.dataCall).subscribe(res => {
      this.list = res.data;
      // this.totalPage = res.data.count;
      // this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/gip/call-history'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/gip/call-history'], { queryParams: this.searchForm })
  }

  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem(ObjectLocalStorage.CURRENT_USER));
    this.contentHeader = {
      headerTitle: 'Lịch sử cuộc gọi',
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
            name: 'Lịch sử cuộc gọi',
            isLink: false
          }
        ]
      }
    };
  }

}
