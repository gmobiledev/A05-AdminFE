import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventoryService } from 'app/auth/service/inventory.service';

@Component({
  selector: 'app-ton-kho-sim',
  templateUrl: './ton-kho-sim.component.html',
  styleUrls: ['./ton-kho-sim.component.scss']
})
export class TonKhoSimComponent implements OnInit {

  public contentHeader = {
    headerTitle: 'Báo cáo tồn kho SIM',
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
          name: 'Báo cáo tồn kho SIM',
          isLink: false
        }
      ]
    }
  };

  searchForm = {
    channel_id: '',
    date: ''
  }
  sumItems = {
    begin_total: 0,
    exported: 0,
    imported: 0,
    total: 0
  }
  list;
  constructor(
    private route: ActivatedRoute,
    private readonly inventoryService: InventoryService
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      this.getData();
    })
  }

  ngOnInit(): void {
  }

  getData() {
    this.inventoryService.reportInventorySim(this.searchForm).subscribe(res => {
      this.list = res.data;
      for(let item of this.list) {
        this.sumItems.begin_total += item.begin_total;
        this.sumItems.exported += item.exported;
        this.sumItems.imported += item.imported;
        this.sumItems.total += item.total;
      }
    })
  }

}
