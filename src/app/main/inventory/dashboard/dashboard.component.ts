import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { InventoryService } from 'app/auth/service/inventory.service';
import Highcharts from "highcharts/highmaps";
const mapData = require('../data/province_vn_2.json');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;

  isHighcharts = typeof Highcharts === 'object';
  chartConstructor = "mapChart";
  Highcharts: typeof Highcharts = Highcharts;
  
  BarHighcharts: typeof Highcharts = Highcharts;
  chartBarOptions = {
    plotOptions: {
      series: {
        stacking: 'normal'
      }
    },
    xAxis: {
      categories: ['A05', 'Gtel', 'GTS', 'C06'],
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    series: [
      {
        type: 'bar',
        data: [10, 30, 5, 58]
      }
      
    ]
  }
  chartMap ;
  data;
  listData;
  listDataTmp;
  searchForm = {
    date: ''
  }
  basicSelectedOption: number = 10;
  isUpdate: boolean = false;
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly commonDataService: CommonDataService
  ) { 
    
  }

  async ngOnInit() {
    await this.getData();
    this.chartMap = {
      chart: {
        map: mapData,        
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
          name: '< 30%'
      }, {
          from: 30,
          to: 70,
          color: '#d17e31',
          name: '30% - 70%'
      }, {
          from: 70,
          to: 80,
          color: '#e6dc2e',
          name: '70% - 80%'
      }, {
          from: 81,
          color: '#2ee640',
          name: '> 80%'
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
    
  }

  ngAfterViewInit(): void {
    
  }

  async searchData() {
    
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
      this.listData = res.data.items.map(x => { return {name: x.name, value: x.value * 100, key: x.key} });
      this.listDataTmp = res.data.items.map(x => { return {name: x.name, value: x.value * 100, key: x.key} });
      this.data = [];
      for(let item of mapData.features) {
        const seData = this.listData.find(x => x.key == item.properties.id);
        this.data.push({
          id: item.properties.id,
          value: seData ? seData.value : 0
        })
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

}
