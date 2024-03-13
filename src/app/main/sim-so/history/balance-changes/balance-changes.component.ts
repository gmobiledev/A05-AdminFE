import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';

@Component({
  selector: 'app-balance-changes',
  templateUrl: './balance-changes.component.html',
  styleUrls: ['./balance-changes.component.scss']
})
export class BalanceChangesComponent implements OnInit {

  searchForm = {
    mobile: ''
  };
  list;

  constructor(
    private readonly telecomService: TelecomService
  ) { }

  ngOnInit(): void {

  }

  onSubmitSearch() {
    this.getData();
  }

  getData() {
    this.telecomService.getMsisdnBalanceChanges(this.searchForm.mobile, null).subscribe(res => {
      this.list = res.data;
    })
  }

}
