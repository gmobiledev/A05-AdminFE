import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import Highcharts from "highcharts/highmaps";
import { BlockUI, NgBlockUI } from 'ng-block-ui';
const mapDataRaw = require('../data/province_vn_2.json');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  isHighcharts = typeof Highcharts === 'object';
  chartConstructor = "mapChart";

  isShowBarChart: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  BarHighcharts: typeof Highcharts = Highcharts;
  chartBarOptions = {
    title: {
      text: 'Biểu đồ tỉ lệ kích hoạt/tổng số'
    },
    plotOptions: {
      series: {
        stacking: 'normal'
      },
      bar: {
        dataLabels: {
            enabled: true,
            align: 'right',
        },
        groupPadding: 0
    }
    },
    tooltip: {
      formatter: function () {
               
        return  'Độ phủ: ' + this.y + ' %' + '</br>' 
        // +
        //   'Số thuê bao kích hoạt: ' + this.point.options.total_active + '</br>' +
        //   'Tổng số thuê bao: ' + this.point.options.total_product          
      }
    },
    xAxis: {
      categories: [],
      title: {
        text: 'Đơn vị'
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: '%',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    series: [
      
      
    ]
  }
  chartMap ;
  data;
  listData;
  listDataTmp;
  listDataChild;
  provinces;
  searchForm = {
    date: '',
    province_id: ''
  }
  mapData = mapDataRaw;
  basicSelectedOption: number = 200;
  isUpdate: boolean = false;
  isUpdateBarChart: boolean = false;  
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly commonDataService: CommonDataService,
    private readonly alertService: SweetAlertService
  ) { 
    
  }

  async ngOnInit() {
    await this.getData();
    this.chartMap = {
      chart: {
        map: this.mapData,        
      },
      title: {
        text: null
      },
  
      mapNavigation: {
        enabled: true,
        buttonOptions: {
          alignTo: 'spacingBox',
          x: 10
        }
      },
  
      colorAxis: {
        dataClasses: [{
          from: 0,
          to: 30,
          color: '#f51800',
          name: 'Chưa đạt SL bàn giao'
      }, {
          from: 30,
          to: 70,
          color: '#d17e31',
          name: 'Chưa đạt SL TB hoạt động'
      }, {
          from: 70,
          to: 80,
          color: '#e6dc2e',
          name: 'Chưa đạt SL đăng ký TTTTB'
      }, {
          from: 81,
          color: '#2ee640',
          name: 'Đạt'
      }]
        // min: 0,
        // max: 100,
        // stops: [
        //   [0, '#f51800'],
        //   [0.3, '#e6dc2e'],
        //   [0.7, '#d17e31'],
        //   [
        //     1,
        //     '#2ee640'
        //   ]
        // ]
      },
  
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom'
      },
  
      series: [
      ]
    };
        
    this.chartMap.series.push({
      type: "map",
      allAreas: false,
      data:  this.data,
      name: 'Độ phủ (%)',
      joinBy: ['id'],
      // states: {
      //   hover: {
      //     color: "#BADA55"
      //   }
      // },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    })
    // this.chartMap.series[0].data  = this.data.map(item => {return [item.key, item.value]});    
    console.log(this.chartMap.series);
    // this.showBarChartAll();
    // this.onClick('');
    
  }

  ngAfterViewInit(): void {
    
  }

  async searchData() {
    this.isShowBarChart = false;
    await this.getData();
    this.chartMap.series = [];
    this.chartMap.series.push({
      type: "map",
      allAreas: false,
      data:  this.data,
      name: 'Độ phủ (%)',
      joinBy: ['id'],
      // states: {
      //   hover: {
      //     color: "#BADA55"
      //   }
      // },
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      }
    })
    // this.isUpdate = true;
    console.log(this.chartMap.series);
    this.isUpdate = true;
  }
  
  async getData() {
    let res = await this.commonDataService.getProvinces().toPromise();
      this.provinces = res.data;
      let datatmp = {...mapDataRaw}
      let i = 0;
      for(let item of datatmp.features) {
        const se = res.data.find(x => x.title.includes(item.properties.name));
        if(se) {
          datatmp.features[i].properties.id = se.id;
        } else {
          console.log(item.properties.name)
        }
        i++;
      }
      this.mapData = datatmp;
    
    try {
      console.log('get data');
      if(!this.searchForm.date) {
        let cDate = new Date()
        const offset = cDate.getTimezoneOffset()
        cDate = new Date(cDate.getTime() - (offset*60*1000))
        this.searchForm.date = cDate.toISOString().split('T')[0]
      }
      console.log(this.searchForm);
      let res  = await this.inventoryService.dashboardHeatmap(this.searchForm).toPromise();
      console.log('success get');
      this.listData = res.data.items;
      console.log(this.listData);
      this.listData = res.data.items.map(x => { return {name: x.name, value: x.value ? (x.value * 100).toFixed(2) : 0, key: x.key, active: x.active, total: x.total} });
      this.listDataTmp = res.data.items.map(x => { return {name: x.name, value:  x.value ? (x.value * 100).toFixed(2) : 0, key: x.key, active: x.active, total: x.total} });
      this.listData.sort((a,b) => b.value - a.value);
      this.listDataTmp.sort((a,b) => b.value - a.value);
      this.data = [];
      for(let item of this.mapData.features) {
        const index = this.data.findIndex(x => x.key == item.properties.id);
        const seData = this.listData.find(x => x.key == item.properties.id);
        if(index != -1) {
          this.data[index].value += (seData ? seData.value : 0)
        } else {
          this.data.push({
            id: item.properties.id,
            value: seData ? seData.value : 0
          })
        }        
      }
      if(this.searchForm.province_id && this.searchForm.province_id != undefined) {
        var id = this.searchForm.province_id;
        const temp = this.listData.filter(function (d) {
          return d.key == id;
        });
    
        // update the rows
        this.listDataTmp = temp;
        console.log(this.listDataTmp);
        // this.showBarChartAll();
      }   
      // this.data = this.listData.map(x => { return { id: x.key, value: x.value } });
    } catch (error) {
      console.log("error", error);
    }
  }

  filterList(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.listData.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.listDataTmp = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onChangeProvine(event) {
    console.log(event);
    if(event && event != undefined) {
      const temp = this.listData.filter(function (d) {
        return d.key == event;
      });
  
      // update the rows
      this.listDataTmp = temp;
      console.log(this.listDataTmp);
      // this.showBarChartAll();
    }    
  }

  clearProvine() {
    this.listDataTmp = [...this.listData]
  }

  async onClick(event) {
    this.sectionBlockUI.start();
    // this.isUpdateBarChart = true;
    let dataPost = { province_id: event };
    let res;
    try {
      res = await this.inventoryService.getChildHeatmapStatus(dataPost).toPromise();  
      this.sectionBlockUI.stop();    
      this.listDataChild = res.map(x => { return {name: x.name, value:  x.value ? (x.value * 100).toFixed(2) : 0, key: x.key} });
      console.log(this.listDataChild);
      this.listDataChild = [...this.listDataChild];
      this.isShowBarChart = true;
      // let i = 0;
      // let data=  {
      //   type: 'bar',
      //   name: 'Độ phủ',
      //   data: []
      // }
      // let categories = [];
      // for(let item of res) {
      //   // const percent = 100* item.totalActive / item.totalProduct
      //   categories[i] = item.name;
      //   data.data[i] = {
      //     y: item.value  ? parseFloat((100 * item.value).toFixed(2)) : 0,
      //     total_active: item.totalActive,
      //     total_product: item.totalProduct,
      //   };
      //   // data.data[i] = percent;
      //   i++;
      // }
      // data.data.sort((a,b) => a.y - b.y);
      // this.chartBarOptions.xAxis.categories = [...categories];
      // this.chartBarOptions.series.push(data);      
      // this.isUpdateBarChart = true;      
    } catch (error) {
      this.sectionBlockUI.stop();
      console.log(error);
      this.alertService.showMess("Vui lòng thử lại sau");
      return;
    }
    
  }

  async showBarChartAll() {    
    let i = 0;
    let data = {
      type: 'bar',
      name: 'Độ phủ',
      data: []
    }
    let categories = [];
    for (let item of this.listDataTmp) {
      // const percent = 100* item.totalActive / item.totalProduct
      categories[i] = item.name;
      data.data[i] = {
        y: item.value ? parseFloat(item.value) : 0,
        // total_active: item.totalActive,
        // total_product: item.totalProduct,
      };
      // data.data[i] = percent;
      i++;
    }
    data.data.sort((a, b) => b.y - a.y);
    this.chartBarOptions.xAxis.categories = [...categories];
    this.chartBarOptions.series.push(data);
    this.isShowBarChart = true;
    this.isUpdateBarChart = true;


  }

  getClassProgressBar(value) {
    let html = 'progress-bar-primary';
    if(value < 30) {
      html = 'progress-bar-danger'
    } else if (value >=30 && value < 70) {
      html  = 'progress-bar-warning'
    } else if (value >=70 && value < 80) {
      html  = 'progress-bar-primary'
    } else {
      html  = 'progress-bar-success'
    }
    return html;
  }

  getAnimateProgress(value) {
    return value >= 80 ? false : true;
  }

  closeBarcharts() {
    this.isShowBarChart = false;
    this.chartBarOptions.xAxis.categories = [];
    this.chartBarOptions.series = [];
  }

}
