import { Component, OnInit } from '@angular/core';
import { AdminService } from 'app/auth/service/admin.service';
import { colors } from 'app/colors.const';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-root-account',
  templateUrl: './root-account.component.html',
  styleUrls: ['./root-account.component.scss']
})

export class RootAccountComponent implements OnInit {


  public contentHeader: any;
  public list: any;
  sums: any;
  total: any;

  public isViewFile: boolean = false;
  public urlFile: any;
  // Private
  private $primary = '#7367F0';
  private $warning = '#FF9F43';


  public avgsessionChartoptions;
  public supportChartoptions;
  public salesChartoptions;
  public isMenuToggled = true;

  private tooltipShadow = 'rgba(0, 0, 0, 0.25)';
  private successColorShade = '#28dac6';
  private warningLightColor = '#FDAC34';
  private grid_line_color = 'rgba(200, 200, 200, 0.2)'; // RGBA color helps in dark layout
  private primaryColorShade = '#836AF9';
  private yellowColor = '#ffe800';


  public data: any = {
    subscribers_gained: {
      series: [
        {
          name: 'Subscribers',
          data: [28, 40, 36, 52, 38, 60, 55]
        }
      ],
      analyticsData: {
        subscribers: '92.6k'
      }
    },
    ordersRecevied: {
      series: [
        {
          name: 'Orders',
          data: [10, 15, 8, 15, 7, 12, 8]
        }
      ],
      analyticsData: {
        orders: '38.4k'
      }
    },
    avgSessions: {
      series: [
        {
          name: 'Sessions',
          data: [75, 125, 225, 175, 125, 75, 25]
        }
      ],
      analyticsData: {
        avgSessions: '2.7k',
        vsLastSevenDays: '+5.2%',
        goal: '$100000',
        goalProgressbar: 50,
        retention: '90%',
        retentionProgressbar: 60,
        users: '100k',
        usersProgressbar: 70,
        duration: '1yr',
        durationProgressbar: 90
      }
    },
    supportTracker: {
      series: [83],
      analyticsData: {
        tickets: 163,
        newTickets: 29,
        openTickets: 63,
        responseTime: '1d'
      }
    },
    salesLastSixMonths: {
      series: [
        {
          name: 'Sales',
          data: [90, 50, 86, 40, 100, 20]
        },
        {
          name: 'Visit',
          data: [70, 75, 70, 76, 20, 85]
        }
      ]
    },
    statistics: {
      analyticsData: {
        sales: '230k',
        customers: '8.549k',
        products: '1.423k',
        revenue: '$9745'
      }
    },
    ordersChart: {
      series: [
        {
          name: '2020',
          data: [45, 85, 65, 45, 65]
        }
      ],
      analyticsData: {
        orders: '2,76k'
      }
    },
    profitChart: {
      series: [
        {
          data: [0, 20, 5, 30, 15, 45]
        }
      ],
      analyticsData: {
        profit: '6,24k'
      }
    },
    revenueReport: {
      earningExpenseChart: {
        series: [
          {
            name: 'Earning',
            data: [95, 177, 284, 256, 105, 63, 168, 218, 72]
          },
          {
            name: 'Expense',
            data: [-145, -80, -60, -180, -100, -60, -85, -75, -100]
          }
        ]
      },
      budgetChart: {
        series: [
          {
            data: [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62]
          },
          {
            data: [20, 10, 30, 15, 23, 0, 25, 15, 20, 5, 27]
          }
        ]
      },
      analyticsData: {
        currentBudget: '$25,852',
        totalBudget: '56,800'
      }
    },
    goalOverview: {
      series: [83],
      analyticsData: {
        completed: '786,617',
        inProgress: '13,561'
      }
    }
  };

  public loading = false;

  public gainedChartoptions = {
    chart: {
      height: 100,
      type: 'area',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      width: 2.5
    },
    colors: [this.$primary],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100]
      }
    },
    tooltip: {
      x: { show: false }
    }
  };

  public orderChartoptions = {
    chart: {
      height: 100,
      type: 'area',
      toolbar: {
        show: false
      },
      sparkline: {
        enabled: true
      },
      width: 2.5
    },
    colors: [this.$warning],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2.5
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100]
      }
    },
    series: [
      {
        name: 'Orders',
        data: [10, 15, 8, 15, 7, 12, 8]
      }
    ],
    tooltip: {
      x: { show: false }
    }
  };

  constructor(
    private adminService: AdminService
  ) {
    this.getData();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tổng quan',
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
            name: 'Tổng quan',
            isLink: false
          }
        ]
      }
    };
  }

  getData() {

  }

  // scatter Chart
  public scatterChart = {
    chartType: 'scatter',
    options: {
      responsive: true,
      maintainAspectRatio: false,
      responsiveAnimationDuration: 800,
      title: {
        display: false,
        text: 'Chart.js Scatter Chart'
      },
      tooltips: {
        // Updated default tooltip UI
        shadowOffsetX: 1,
        shadowOffsetY: 1,
        shadowBlur: 8,
        shadowColor: this.tooltipShadow,
        backgroundColor: colors.solid.white,
        titleFontColor: colors.solid.black,
        bodyFontColor: colors.solid.black
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            },
            ticks: {
              stepSize: 10,
              min: 0,
              max: 140
            }
          }
        ],
        yAxes: [
          {
            gridLines: {
              color: this.grid_line_color,
              zeroLineColor: this.grid_line_color
            },
            ticks: {
              stepSize: 100,
              min: 0,
              max: 400
            }
          }
        ]
      },
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          usePointStyle: true,
          padding: 25,
          boxWidth: 9
        }
      }
    },

    datasets: [
      {
        label: 'iPhone',
        data: [
          {
            x: 72,
            y: 225
          },
          {
            x: 81,
            y: 270
          },
          {
            x: 90,
            y: 230
          },
          {
            x: 103,
            y: 305
          },
          {
            x: 103,
            y: 245
          },
          {
            x: 108,
            y: 275
          },
          {
            x: 110,
            y: 290
          },
          {
            x: 111,
            y: 315
          },
          {
            x: 109,
            y: 350
          },
          {
            x: 116,
            y: 340
          },
          {
            x: 113,
            y: 260
          },
          {
            x: 117,
            y: 275
          },
          {
            x: 117,
            y: 295
          },
          {
            x: 126,
            y: 280
          },
          {
            x: 127,
            y: 340
          },
          {
            x: 133,
            y: 330
          }
        ],
        borderColor: 'transparent',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: colors.solid.primary,
        pointHoverBackgroundColor: colors.solid.primary,
        pointHoverBorderColor: colors.solid.primary
      },
      {
        label: 'Samsung Note',
        data: [
          {
            x: 13,
            y: 95
          },
          {
            x: 22,
            y: 105
          },
          {
            x: 17,
            y: 115
          },
          {
            x: 19,
            y: 130
          },
          {
            x: 21,
            y: 125
          },
          {
            x: 35,
            y: 125
          },
          {
            x: 13,
            y: 155
          },
          {
            x: 21,
            y: 165
          },
          {
            x: 25,
            y: 155
          },
          {
            x: 18,
            y: 190
          },
          {
            x: 26,
            y: 180
          },
          {
            x: 43,
            y: 180
          },
          {
            x: 53,
            y: 202
          },
          {
            x: 61,
            y: 165
          },
          {
            x: 67,
            y: 225
          }
        ],
        pointBackgroundColor: this.yellowColor,
        borderColor: 'transparent',
        pointRadius: 5,
        pointHoverBackgroundColor: this.yellowColor,
        pointHoverBorderColor: this.yellowColor
      },
      {
        label: 'OnePlus',
        data: [
          {
            x: 70,
            y: 195
          },
          {
            x: 72,
            y: 270
          },
          {
            x: 98,
            y: 255
          },
          {
            x: 100,
            y: 215
          },
          {
            x: 87,
            y: 240
          },
          {
            x: 94,
            y: 280
          },
          {
            x: 99,
            y: 300
          },
          {
            x: 102,
            y: 290
          },
          {
            x: 110,
            y: 275
          },
          {
            x: 111,
            y: 250
          },
          {
            x: 94,
            y: 280
          },
          {
            x: 92,
            y: 340
          },
          {
            x: 100,
            y: 335
          },
          {
            x: 108,
            y: 330
          }
        ],
        pointBackgroundColor: this.successColorShade,
        borderColor: 'transparent',
        pointBorderWidth: 2,
        pointHoverBorderWidth: 2,
        pointRadius: 5,
        pointHoverBackgroundColor: this.successColorShade,
        pointHoverBorderColor: this.successColorShade
      }
    ]
  };

  // doughnut Chart
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
        labels: ['Tablet', 'Mobile', 'Desktop'],
        data: [10, 10, 80],
        backgroundColor: [this.successColorShade, this.warningLightColor, colors.solid.primary],
        borderWidth: 0,
        pointStyle: 'rectRounded'
      }
    ]
  };

}

