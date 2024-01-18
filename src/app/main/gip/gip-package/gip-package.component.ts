import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { GipService } from 'app/auth/service/gip.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import dayjs from 'dayjs';

@Component({
  selector: 'app-gip-package',
  templateUrl: './gip-package.component.html',
  styleUrls: ['./gip-package.component.scss']
})
export class GipPackageComponent implements OnInit {
  public contentHeader: any = {
    headerTitle: 'Danh sách gói cước GIP',
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
          name: 'Gói cước GIP',
          isLink: false
        }
      ]
    }
  };
  public searchForm: any = {
    name: '',
    status: '',
    page: 1,
    array_status: [],
    page_size: 20,
    date_range: '',
  }
  dateRange: any;
  totalItems: number = 0;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public list: any;
  constructor(
    private modalService: NgbModal,
    private router: Router,
    private activeRouted: ActivatedRoute,
    private adminService: AdminService,
    private alertService: SweetAlertService,
    private gipService: GipService
  ) { }



  ngOnInit(): void {
    this.getData()
  }

  onSubmitSearch() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate
      ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    this.searchForm.date_range = daterangeString;
    this.router.navigate(['/gip/package'], { queryParams: this.searchForm });
  }

  getData() {
    this.gipService.getPackage(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.totalItems = res.data.count;
    });

  }

}
