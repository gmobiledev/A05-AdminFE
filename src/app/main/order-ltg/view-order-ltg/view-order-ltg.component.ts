import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderLtgService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-view-order-ltg',
  templateUrl: './view-order-ltg.component.html',
  styleUrls: ['./view-order-ltg.component.scss']
})
export class ViewOrderLtgComponent implements OnInit {

  public id: any;
  public order: any;
  public orderProduct: any;

  public contentHeader: any =  {
    headerTitle: 'Chi tiết đơn hàng LTG',
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
          name: 'Danh sách đơn hàng LTG',
          isLink: true,
          link: '/loan-bank'
        },
        {
          name: 'Chi tiết đơn hàng LTG',
          isLink: false
        }
      ]
    }
  };

  constructor(
    private modalService: NgbModal,
    private activedRoute: ActivatedRoute,
    private orderService: OrderLtgService,  
    private _alertService: SweetAlertService,  
  ) { 
    this.id = this.activedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.orderService.getById(this.id).subscribe(res => {
      this.order = res.data.order;
      this.orderProduct = res.data.product;      
    })
  }
}
