import { AfterViewInit, Component, OnInit } from '@angular/core';
import Highcharts from "highcharts/highmaps";
const mapData = require('../data/province_vn_2.json');

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  isHighcharts = typeof Highcharts === 'object';
  chartConstructor = "mapChart";
  Highcharts: typeof Highcharts = Highcharts;
  chartMap ;
  data;
  constructor() { 
    
  }

  ngOnInit(): void {
    console.log(mapData);
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
        stops: [
          [0, '#f51800'],
          [0.5, '#e6dc2e'],
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
    this.data = mapData.features.map((g, value) => ({
      name: g.properties['name'],
      value
    }));    
    console.log(this.data);
    console.log(this.data.map(item => {return [item.key, item.value]}));
    console.log(this.chartMap.series[0]);
    this.chartMap.series.push({
      type: "map",
      allAreas: false,
      data:  this.data,
      name: 'Random data',
      joinBy: ['name'],
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
    console.log(this.chartMap.series[0].data);
    // this.chartMap.series[0] = {
    //   type: "map",
    //   data: this.data,
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
    // };

    console.log(this.chartMap.series);
    
  }

  ngAfterViewInit(): void {
    
  }

}
