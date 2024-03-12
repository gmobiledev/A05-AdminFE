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
        min: 0,
        max: 100,
        stops: [
          [0, '#f51800'],
          [0.3, '#e6dc2e'],
          [0.7, '#d17e31'],
          [
            1,
            '#2ee640'
          ]
        ]
      },
  
      legend: {
        layout: 'vertical',
        align: 'left',
        verticalAlign: 'bottom'
      },
  
      series: [ 
        // {
        //   type: "map",
        //   allAreas: false,
        //   // data: null,
        //   // joinBy: ['hc-key', 'key'],
        //   name: 'Random data',
        //   states: {
        //     hover: {
        //       color: "#BADA55"
        //     }
        //   },
        //   dataLabels: {
        //     enabled: true,
        //     format: '{point.name}'
        //   }
        // }
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
    this.isUpdate = true;
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
    // this.isUpdate = false;
  }
  
  async getData() {
    try {
      console.log('get data');
      console.log(this.searchForm);
      let res  = await this.inventoryService.dashboardHeatmap(this.searchForm).toPromise();
      console.log('success get');
      this.listData = res.data.items;
      console.log(this.listData);
      this.listData = res.data.items.map(x => { return {name: x.name, value: x.value * 10, key: x.key} });
      this.listDataTmp = res.data.items.map(x => { return {name: x.name, value: x.value * 10, key: x.key} });
      this.data = this.listData.map(x => { return { id: x.key, value: x.value } });
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
