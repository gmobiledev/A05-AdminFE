import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';

@Component({
  selector: 'app-search-sim-so',
  templateUrl: './search-sim-so.component.html',
  styleUrls: ['./search-sim-so.component.scss']
})
export class SearchSimSoComponent implements OnInit {

  public total: any;
  public item: any;
  public showMessage: boolean

  public searchSim: any = {
    keysearch: '',
    category_id: 2,
    take: 10,
  }
  productListAll: any;
  constructor(
    private telecomService: TelecomService,

  ) {
  }
  onSubmitSearch() {
    console.log(this.searchSim);

    this.telecomService.getDetailSim(this.searchSim).subscribe(res => {
      if (res.data) {
        this.showMessage = false;
        this.item = res.data
        this.total = res.data.count;
      } else {
        this.item = null
        this.showMessage = true;
      }

    })
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }

}