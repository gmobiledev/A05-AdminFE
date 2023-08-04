import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { ToastService } from 'app/main/components/toasts/toasts.service';
import { init } from 'node-waves';

@Component({
  selector: 'app-search-sim-so',
  templateUrl: './search-sim-so.component.html',
  styleUrls: ['./search-sim-so.component.scss']
})
export class SearchSimSoComponent implements OnInit {

  public total: any;
  public item: any;

  public searchSim: any = {
    keysearch: '',
    category_id: 2,
    take: 10,
  }
  productListAll: any;
  constructor(
    private telecomService: TelecomService,
    private toastr: ToastService
  ) {
  }
  onSubmitSearch() {
    console.log(this.searchSim);

    this.telecomService.getDetailSim(this.searchSim).subscribe(res => {
      if (res.data) {
        this.item = res.data
        this.total = res.data.count;
      } else {
        this.toastr.show('Success!');
      }

    })
  }
  ngOnInit(): void {
    this.getData();
  }
  getData(): void {
  }
}