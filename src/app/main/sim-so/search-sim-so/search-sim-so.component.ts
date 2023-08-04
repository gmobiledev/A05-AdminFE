import { Component, OnInit } from '@angular/core';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { UserService } from 'app/auth/service';

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
    private alertService: SweetAlertService,
    private userService: UserService,

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

  async onSubmitLock(id, status){
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if((await this.alertService.showConfirm(confirmMessage)).value) {
      this.userService.lockUser(id, status, "").subscribe(res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

}