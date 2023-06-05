

import { Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';

// Ng-Apexcharts
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexResponsive,
  ApexStates,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { colors } from 'app/colors.const';
import { CardAnalyticsService } from 'app/main/ui/card/card-analytics/card-analytics.service';
import { CoreConfigService } from '@core/services/config.service';
import { AdminService } from 'app/auth/service/admin.service';

// Interface Chartoptions
export interface ChartOptions {
  // Apex-Non-Axis-Chart-Series
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors: string[];
  legend: ApexLegend;
  labels: any;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  markers: ApexMarkers[];
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  states: ApexStates;
}

// Interface Chartoptions2
export interface ChartOptions2 {
  // Apex-Axis-Chart-Series
  series: ApexAxisChartSeries;
  chart: ApexChart;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors: string[];
  legend: ApexLegend;
  labels: any;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  markers: ApexMarkers;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  states: ApexStates;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
  // Decorator
  @ViewChild('supportChartoptionsRef') supportChartoptionsRef: any;
  @ViewChild('avgsessionChartoptionsRef') avgsessionChartoptionsRef: any;
  @ViewChild('revenueReportChartoptionsRef') revenueReportChartoptionsRef: any;
  @ViewChild('budgetChartoptionsRef') budgetChartoptionsRef: any;
  @ViewChild('goalChartoptionsRef') goalChartoptionsRef: any;
  @ViewChild('revenueChartoptionsRef') revenueChartoptionsRef: any;
  @ViewChild('salesChartoptionsRef') salesChartoptionsRef: any;
  @ViewChild('salesavgChartoptionsRef') salesavgChartoptionsRef: any;
  @ViewChild('sessionChartoptionsRef') sessionChartoptionsRef: any;
  @ViewChild('customerChartoptionsRef') customerChartoptionsRef: any;
  @ViewChild('orderChartoptionsRef') orderChartoptionsRef: any;
  @ViewChild('earningChartoptionsRef') earningChartoptionsRef: any;

  // Public
  public contentHeader: object;
  public data: any;

  // Charts Of Interface Chartoptions
  public sessionChartoptions: Partial<ChartOptions>;
  public orderChartoptions: Partial<ChartOptions>;
  public customerChartoptions: Partial<ChartOptions>;
  public supportChartoptions: Partial<ChartOptions>;
  public goalChartoptions: Partial<any>;
  public revenueReportChartoptions: Partial<ChartOptions2>;

  // Charts Of Interface Chartoptions2
  public budgetChartoptions: Partial<ChartOptions2>;
  public salesChartoptions: Partial<ChartOptions2>;
  public revenueChartoptions: Partial<ChartOptions2>;
  public avgsessionChartoptions: Partial<ChartOptions2>;
  public salesavgChartoptions: Partial<ChartOptions2>;
  public retentionChartoptions: Partial<ChartOptions2>;
  public earningChartoptions;
  public isMenuToggled = false;
  // Private
  private $primary = '#7367F0';
  private $danger = '#EA5455';
  private $warning = '#FF9F43';
  private $info = '#00cfe8';
  private $success = '#00db89';
  private $primary_light = '#9c8cfc';
  private $warning_light = '#FFC085';
  private $danger_light = '#f29292';
  private $info_light = '#1edec5';
  private $stroke_color = '#ebe9f1';
  private $label_color = '#e7eef7';
  private $purple = '#df87f2';
  private $white = '#fff';

  private $textHeadingColor = '#5e5873';
  private $strokeColor = '#ebe9f1';
  private $labelColor = '#e7eef7';
  private $avgSessionStrokeColor2 = '#ebf0f7';
  private $budgetStrokeColor2 = '#dcdae3';
  private $goalStrokeColor2 = '#51e5a8';
  private $revenueStrokeColor2 = '#d0ccff';
  private $textMutedColor = '#b9b9c3';
  private $salesStrokeColor2 = '#df87f2';
  private $earningsStrokeColor2 = '#28c76f66';
  private $earningsStrokeColor3 = '#28c76f33';

  private _unsubscribeAll: Subject<any>;
  public currentUser: any;

  public searchForm: any = {
    mobile: '',
    action: '',
    status: '',
    mine: '',
    page: 1,
    array_status: [],
    page_size: 20,
    date_range: '',
    telco: '',
    detail: ''
  }
  dateRange: any;
  public reportTask;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   * @param {CardAnalyticsService} _cardAnalyticsService
   */
  constructor(
    private _cardAnalyticsService: CardAnalyticsService,
    private _coreConfigService: CoreConfigService,
    private adminService: AdminService,
  ) {
    this._unsubscribeAll = new Subject();

    // Revenue Report Chart
    this.revenueReportChartoptions = {
      chart: {
        height: 230,
        stacked: true,
        type: 'bar',
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          columnWidth: '17%',
          endingShape: 'rounded'
        }
      },
      colors: [colors.solid.primary, colors.solid.warning],
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10
        },
        yaxis: {
          lines: { show: false }
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        labels: {
          style: {
            colors: this.$textMutedColor,
            fontSize: '0.86rem'
          }
        },
        axisTicks: {
          show: false
        },
        axisBorder: {
          show: false
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: this.$textMutedColor,
            fontSize: '0.86rem'
          }
        }
      }
    };
   

   

    // Sales Chart
    this.salesChartoptions = {
      chart: {
        height: 325,
        type: 'radar',
        dropShadow: {
          enabled: true,
          blur: 8,
          left: 1,
          top: 1,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      stroke: {
        width: 0
      },
      colors: [this.$primary, this.$info],
      plotOptions: {
        radar: {
          polygons: {
            connectorColors: 'transparent'
          }
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#9f8ed7', this.$info_light],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 0
      },
      legend: {
        show: false
      },
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      dataLabels: {
        style: {
          colors: [
            this.$stroke_color,
            this.$stroke_color,
            this.$stroke_color,
            this.$stroke_color,
            this.$stroke_color,
            this.$stroke_color
          ]
        }
      },
      yaxis: {
        show: false
      }
    };

  
    // Sales  Chart
    this.salesavgChartoptions = {
      chart: {
        height: 270,
        toolbar: { show: false },
        type: 'line',
        dropShadow: {
          enabled: true,
          top: 20,
          left: 2,
          blur: 6,
          opacity: 0.2
        }
      },
      stroke: {
        curve: 'smooth',
        width: 4
      },
      grid: {
        borderColor: this.$label_color
      },
      legend: {
        show: false
      },
      colors: [this.$purple],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          inverseColors: false,
          gradientToColors: [this.$primary],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      xaxis: {
        labels: {
          style: {
            colors: this.$stroke_color
          }
        },
        axisTicks: {
          show: false
        },
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        axisBorder: {
          show: false
        },
        tickPlacement: 'on'
      },
      yaxis: {
        tickAmount: 5,
        labels: {
          formatter: function (val) {
            return <string>(val > 999 ? (val / 1000).toFixed(1) + 'k' : val);
          }
        }
      },
      tooltip: {
        x: { show: false }
      }
    };
    
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    this._cardAnalyticsService.onCardAnalyticsChanged.pipe(takeUntil(this._unsubscribeAll)).subscribe(response => {
      this.data = response;
      console.log(this.data);
    });

    // Content Header
    this.contentHeader = {
      headerTitle: 'Báo cáo tài chính',
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
            name: 'Báo cáo tài chính',
            isLink: false
          }
        ]
      }
    };
  }

  /**
   * After View Init
   */
  ngAfterViewInit() {
    // Subscribe to core config changes
    this._coreConfigService.getConfig().subscribe(config => {
      // If Menu Collapsed Changes
      if (
        (config.layout.menu.collapsed === true || config.layout.menu.collapsed === false) &&
        localStorage.getItem('currentUser')
      ) {
        setTimeout(() => {
          // Get Dynamic Width for Charts
          this.isMenuToggled = true;
          this.salesChartoptions.chart.width = this.salesChartoptionsRef?.nativeElement.offsetWidth;
          this.salesavgChartoptions.chart.width = this.salesavgChartoptionsRef?.nativeElement.offsetWidth;

        }, 500);
      }
    });
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))

    this.adminService.reportTask(this.searchForm).subscribe(res => {
        this.reportTask = res.data
    });

  }
}

