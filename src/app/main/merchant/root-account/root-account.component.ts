import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';
import { colors } from 'app/colors.const';
import { CoreConfigService } from '@core/services/config.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ActivatedRoute, Router } from '@angular/router';

import { User } from 'app/auth/models';
import { AuthenticationService, UserService } from 'app/auth/service';
import { DashboardService } from 'app/main/dashboard/dashboard.service';
import { TransactionServivce } from 'app/auth/service/transaction.service';
import dayjs from 'dayjs';
dayjs.locale('vi')

@Component({
  selector: 'app-root-account',
  templateUrl: './root-account.component.html',
  styleUrls: ['./root-account.component.scss']
})

export class RootAccountComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader: any;

  public listIn: any;
  public listOut: any;

  public isViewFile: boolean = false;
  public urlFile: any;

  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;

  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private successColorShade = '#28dac6';
  private warningLightColor = '#FDAC34';


  public total: number;
  public page: number = 1;
  public pageSize: number;

  public sumIn = 0;
  public sumOut = 0;

  public balance;

  public loading = false;
  public doughnutChart = {
    chartType: 'doughnut',
    options: {
      responsive: false,
      responsiveAnimationDuration: 500,
      cutoutPercentage: 60,
      aspectRatio: 1.4,
      legend: { display: false },
      tooltips: {
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[0].labels[tooltipItem.index] || '',
              value = data.datasets[0].data[tooltipItem.index];
            var output = ' ' + label + ' : ' + value + ' %';
            return output;
          }
        },
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black
      }
    },

    datasets: [
      {
        labels: ['Tiền vào', 'Tiền ra'],
        backgroundColor: [this.successColorShade, this.warningLightColor],
        borderWidth: 0,
        data: [1, 1],
        pointStyle: 'rectRounded'
      }
    ]
  };

  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],    
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  public searchForm = {
    user: '',
    title: '',
    status: '',
    daterange: '',
    trans_id: '',
    is_customer_sign: '',
    is_guarantee_sign: '',
    is_bank_sign: '',
    page: 1,
    service_code: '',
    page_size: 20,
    money_out: 0
  }

  constructor(
    private userService: UserService,
    private transactionService: TransactionServivce,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Thông tin tài khoản',
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
            name: 'Thông tin tài khoản',
            isLink: false
          }
        ]
      }
    };
    this.getData();
  }

  onSubmitSearch(): void {
    this.router.navigate(['/merchant/root'], { queryParams: this.searchForm})
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/merchant/root'], { queryParams: this.searchForm });
  }

  getData() {
    this.sectionBlockUI.start();
    this.transactionService.getMoneyIn().subscribe(res => {
      this.sectionBlockUI.stop();
      this.listIn = res.data.items;
      this.sumIn = res.data.sum_in ? Math.abs(res.data.sum_in) : 0;
      this.sumOut = res.data.sum_out ? Math.abs(res.data.sum_out) : 0;
      this.doughnutChart.datasets[0].data[0] = (this.sumIn / (this.sumIn + this.sumOut) * 100)
      this.doughnutChart.datasets[0].data[1] = (this.sumOut / (this.sumIn + this.sumOut) * 100)

      this.total = res.data.count;
      this.pageSize = res.data.pageSize;

    })

    this.userService.getRootMerchantBalance().subscribe(res => {
      this.balance = res.data && res.data.balance ? res.data.balance : 0
    })

  }

}

