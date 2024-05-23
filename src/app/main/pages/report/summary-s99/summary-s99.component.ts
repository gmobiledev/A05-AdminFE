import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { colors } from 'app/colors.const';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexGrid, ApexStroke, ApexLegend, ApexTitleSubtitle, ApexTooltip, ApexPlotOptions, ApexYAxis, ApexFill, ApexMarkers, ApexTheme, ApexNonAxisChartSeries, ApexResponsive, ApexStates } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ChartOptions {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  fill?: ApexFill;
  labels?: string[];
  markers: ApexMarkers;
  theme: ApexTheme;
}

export interface ChartOptions2 {
  // Apex-non-axis-chart-series
  series?: ApexNonAxisChartSeries;
  chart?: ApexChart;
  stroke?: ApexStroke;
  tooltip?: ApexTooltip;
  dataLabels?: ApexDataLabels;
  fill?: ApexFill;
  colors?: string[];
  legend?: ApexLegend;
  labels?: any;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  markers?: ApexMarkers[];
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis;
  states?: ApexStates;
}

@Component({
  selector: 'app-summary-s99',
  templateUrl: './summary-s99.component.html',
  styleUrls: ['./summary-s99.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryS99Component implements OnInit {
  @ViewChild('apexBarChartRef') apexBarChartRef: any;
  @ViewChild('summaryNumberRef') summaryNumberRef: any;

  public apexBarChartActive: Partial<ChartOptions>;
  public apexBarChartDoanhThu: Partial<ChartOptions>;
  public apexBarChartTop: Partial<ChartOptions>;
  public apexBarChartTTTB: Partial<ChartOptions>;
  public DateRangeOptions = {
    altInput: true,
    mode: 'range',
    altInputClass: 'form-control flat-picker bg-transparent border-0 shadow-none flatpickr-input',
    defaultDate: ['2019-05-01', '2019-05-10'],
    altFormat: 'Y-n-j'
  };
  commonConfigBar = {
    chart: {
      height: 'auto',
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
          bar: {
            distributed: true,
            horizontal: true,
          }
        },
    grid: {
      yaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: [],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '8px',
        colors: ["#ffffff"]
      }
    },
  };
  commonConfigColumn = {
    chart: {
      height: 'auto',
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      }
    },
    grid: {
      yaxis: {
        lines: {
          show: false
        }
      }
    },

    
    colors: [colors.solid.info],
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '8px',
        colors: ["#304758"]
      }
    },
  }

  commonConfigColumnMoney = {
    chart: {
      height: 'auto',
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      }
      
    },
    grid: {
      yaxis: {
        lines: {
          show: false
        },
        
      }
    },
    yaxis: [],
    
    colors: [colors.solid.info],
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: '8px',
        colors: ["#304758"]
      }
    },
  }

  changeHeight = false;
  commonHeight;

  public summaryTotal = {
    active: 0,
    revenue: 0,
    exported: 0,
    da_kich_hoat: 0
  }
  
  public coreConfig: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {CoreConfigService} _coreConfigService
   */
  constructor(private _coreConfigService: CoreConfigService, private readonly inventoryService: InventoryService) {
    this._unsubscribeAll = new Subject();

    // Configure the layout
    this._coreConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        menu: {
          hidden: true
        },
        customizer: false,
        enableLocalStorage: false
      }
    };
    
    let currentDate = new Date();
    let previous30 = new Date();
    previous30.setDate(previous30.getDate() - 30);
    this.DateRangeOptions.defaultDate = [previous30.toISOString().slice(0,10), currentDate.toISOString().slice(0,10)]

  
    
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  async ngOnInit() {
    
    
    // Subscribe to config changes
    this._coreConfigService.config.pipe(takeUntil(this._unsubscribeAll)).subscribe(config => {
      this.coreConfig = config;
    });
    this.getData();
    this.polling();
  }

  ngAfterViewInit() {
    const heightSummary = this.summaryNumberRef.nativeElement.offsetHeight;
    console.log("window.screen.height", window.screen.height);
    console.log("heightSummary", heightSummary);
    const heightPerchart = (window.screen.height - heightSummary - 230) / 2;
    console.log("heightPerchart", heightPerchart);

    this.apexBarChartActive.chart.height = heightPerchart;
    this.apexBarChartDoanhThu.chart.height = heightPerchart;
    this.apexBarChartTTTB.chart.height = heightPerchart;
    this.apexBarChartTop.chart.height = heightPerchart;
    this.commonHeight = heightPerchart;
    this.changeHeight = true;
  }

  polling() {
    var ctx = this;
    setInterval(function () {
      ctx.getData()
    }, 1000 * 60 * 3);
  }

  async getData() {
    let res = await this.inventoryService.getReportSummaryS99().toPromise()
    this.summaryTotal = res.sum[0]
    this.apexBarChartActive = Object.assign({
      series: res.chart_tb_hoatdong.series,
      xaxis: res.chart_tb_hoatdong.xaxis
    }, this.commonConfigColumn) as Partial<ChartOptions>;
    this.apexBarChartActive.xaxis.categories = this.apexBarChartActive.xaxis.categories.map(x => x.slice(0, 10).split('-').reverse().join('/').slice(0, 5))

    this.apexBarChartDoanhThu = Object.assign({
      series: res.chart_doanhthu.series,
      xaxis: res.chart_doanhthu.xaxis
    }, this.commonConfigColumnMoney) as Partial<ChartOptions>;
    this.apexBarChartDoanhThu.xaxis.categories = this.apexBarChartDoanhThu.xaxis.categories.map(x => x.slice(0, 10).split('-').reverse().join('/').slice(0, 5))
    this.apexBarChartDoanhThu.colors = ['#198754'];
    console.log("apexBarChartDoanhThu", this.apexBarChartDoanhThu);
    // this.apexBarChartDoanhThu.xaxis.labels = {
    //   formatter: function(value, opt) {
    //     console.log("----- format", value, opt)
    //     return value + ''
    //   }
    // }
    this.apexBarChartDoanhThu.yaxis.labels = {
      formatter: function(value) {
        console.log("----- format")
        // let r;
        // var val = Math.abs(value)
        // if(val >= 1000000000) {
        //   r = (val / 1000000000).toFixed(2) + ' B'
        // } else if (val >= 1000000) {
        //   r = (val / 1000000).toFixed(2) + ' M'
        // }
        // else if (val >= 1000) {
        //   r = (val / 1000).toFixed(2) + ' K'
        // } else {
        //   r = val + ' X';
        // }
        return value + ' X'
      }
    }

    this.apexBarChartTTTB = Object.assign({
      series: res.chart_dktttb.series,
      xaxis: res.chart_dktttb.xaxis
    }, this.commonConfigColumn) as Partial<ChartOptions>;
    this.apexBarChartTTTB.xaxis.categories = this.apexBarChartTTTB.xaxis.categories.map(x => x.slice(0, 10).split('-').reverse().join('/').slice(0, 5))
    this.apexBarChartTTTB.colors = ['#6610f2']
    const date = new Date().toISOString().slice(0, 10);
    let res2 = await this.inventoryService.getHeatmapPrivate({ date: date }).toPromise()
    const top10 = res2.data.items.sort((a, b) => b.value - a.value).slice(0, 5);
    console.log("top10", top10);
    // this.apexBarChartTop.series[0].data = top10.map(x => (x.value * 100).toFixed(2));
    // this.apexBarChartTop.xaxis.categories = top10.map(x => x.name);

    this.apexBarChartTop = Object.assign({
      series: [
        {
          data: top10.map(x => (x.value * 100).toFixed(2))
        }
      ],
      xaxis: {
        categories:  top10.map(x => x.name)
      },
    }, this.commonConfigBar) as Partial<ChartOptions>;

    for (let item of this.apexBarChartTop.series[0].data as number[]) {
      console.log("item", item);
      if (item < 30) {
        this.apexBarChartTop.colors.push('#dc3545')
      } else if (item >= 30 && item < 70) {
        this.apexBarChartTop.colors.push('#ffc107')
      } else if (item >= 70 && item < 80) {
        this.apexBarChartTop.colors.push('#0d6efd')
      } else {
        this.apexBarChartTop.colors.push('#198754')
      }
    }
    console.log(this.apexBarChartTop);
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
