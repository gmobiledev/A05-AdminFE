import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { init } from 'node-waves';

@Component({
  selector: 'app-search-sim-so',
  templateUrl: './search-sim-so.component.html',
  styleUrls: ['./search-sim-so.component.scss']
})
export class SearchSimSoComponent implements OnInit {
  public list: any;
  public total: any;
  public searchSim: any = {
    keysearch:'',
    category_id:2,
    take: 10,
  }
  productListAll:any;
  constructor(
     private telecomService: TelecomService
  ) {
  }
  onSubmitSearch() {
    console.log(this.searchSim);
    this.telecomService.productListAll(this.searchSim).subscribe(res => {
         this.list = res.data.products;
         this.total= res.data.count;
       })
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }
}