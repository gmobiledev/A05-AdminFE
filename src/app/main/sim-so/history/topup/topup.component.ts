import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';

@Component({
  selector: 'app-topup',
  templateUrl: './topup.component.html',
  styleUrls: ['./topup.component.scss']
})
export class TopupComponent implements OnInit {

  searchForm = {
    mobile: ''
  }
  list;

  constructor(
    private readonly telecomService: TelecomService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  onSubmitSearch() {
    this.getData();
  }

  getData() {
    this.telecomService.getMsisdnTopup(this.searchForm.mobile).subscribe(res => {
      this.list = res.data;
    })
  }
}
