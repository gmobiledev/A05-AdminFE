import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BatchType, ProductStatus, ProductStoreStatus } from 'app/utils/constants';
import dayjs from 'dayjs';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-search-products-transfer',
  templateUrl: './search-products-transfer.component.html',
  styleUrls: ['./search-products-transfer.component.scss']
})
export class SearchProductsTransferComponent implements OnInit {

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  public contentHeader: any = {
    headerTitle: 'Tra cứu nhập/xuất',
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
          name: 'Tra cứu nhập/xuất',
          isLink: false
        }
      ]
    }
  };
  public list: any;
  public totalItems: number;
  public searchForm: any = {
    page: 1,
    page_size: 20,
    status: '',
    array_status: [],
    type: BatchType.OUTPUT,
    date_range: '',
    category_id: 3,
    keysearch: '',
    channel_id: ''
  }
  productStatus;
  dateRange: any;
  submitted: boolean = false;
  batchType = BatchType;
  modalRef;
  showChannel;
  isShowStatusKhoTong: boolean = false;
  public taskTelecomStatus;

  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }

  constructor(
    private readonly commonService: CommonService,
    private readonly inventoryService: InventoryService,
    private readonly router: Router,
    private readonly activeRouted: ActivatedRoute,
    private modalService: NgbModal,
  ) {
    // this.productStatus = Object.keys(ProductStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
    //   obj[key] = ProductStatus[key];
    //   return obj;
    // }, {});
    this.activeRouted.queryParams.subscribe(params => {
      this.taskTelecomStatus = [
        { value: 'used', label: 'Đã sử dụng' },
        { value: 'unused', label: 'Chưa sử dụng' }
      ];
      this.searchForm.status = params['status'] ?? '';
      this.searchForm.type = params['type'] && params['type'] != undefined ? params['type'] : this.batchType.OUTPUT;
      this.searchForm.category_id = params['category_id'] && params['category_id'] != undefined ? params['category_id'] : 3;
      this.searchForm.keysearch = params['keysearch'] && params['keysearch'] != undefined ? params['keysearch'] : '';
      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ? params['channel_id'] : '';
      if(!params['date_range']) {
        this.initDefaultDateRange();
      } else {
        this.searchForm.date_range = params['date_range'];
      }
      
      this.getData();
    })
   }

  ngOnInit(): void {
  }

  onSubmitSearch() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
    if (this.searchForm.status === 'used') {
    this.searchForm.status_array = [1, 6];
    } else if (this.searchForm.status === 'unused') {
      this.searchForm.status_array = [0, 2, 3, 4, 5, 21, 30, 98, 99];
    } else {
      this.searchForm.status_array = [];
    }
    this.router.navigate(['/inventory/search-product-transfer'], { queryParams: this.searchForm});
  }

  initDefaultDateRange() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let currentDate = new Date(new Date().getTime() - tzoffset);
    let firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    let lastDay  = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    this.dateRange = {
      startDate: firstDay,
      endDate: lastDay
    }
    
    const daterangeString = this.dateRange.startDate && this.dateRange.endDate 
    ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0,10) : '';
    this.searchForm.date_range = daterangeString;
  }

  modalChannelOpen(modal, item) {
    if (item) {
      const sub_channel_id = item.sub_channel_id ? item.sub_channel_id : ( item.sell_channels && item.sell_channels[0] ? item.sell_channels[0].channel_id : '' )
      if(sub_channel_id) {
        this.inventoryService.viewDetailSell(sub_channel_id).subscribe(res => {
          this.showChannel = res.data.items[0];
  
          this.modalRef = this.modalService.open(modal, {
            centered: true,
            windowClass: 'modal modal-primary',
            size: 'sm'
          });
  
        })
      }
      
    }
  }

  modalClose() {
    this.modalRef.close();
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/search-product-transfer'], { queryParams: this.searchForm})
  }

  async exportExcelByLocal() {
    this.submitted = true;
    this.sectionBlockUI.start();
    let paramSearch = {};
    for(let key in this.searchForm) {
      paramSearch[key] = this.searchForm[key]
    }
    paramSearch['ignore_paging'] = 1;
    this.inventoryService.searchProductsTransfer(paramSearch).subscribe(async res => {
      let data: any = res.data.items;
      await this.commonService.downloadFile(data, 'danh sach', ['name', 'short_desc', 'brand', 'level', 'category_id', 'is_kit',  'price', 'status', 'created_at'])
      this.sectionBlockUI.stop();
      this.submitted = false;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

  getData() {
    this.sectionBlockUI.start();
    this.inventoryService.searchProductsTransfer(this.searchForm).subscribe(res => {
      if(this.searchForm.type == BatchType.INPUT && res.data.is_kho_tong) {
        this.productStatus = Object.keys(ProductStoreStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
          if([ProductStoreStatus.STATUS_AVAILABLE, ProductStoreStatus.STATUS_EXPORTED, ProductStoreStatus.STATUS_SOLD].includes(ProductStoreStatus[key])) {                    
            obj[key] = ProductStoreStatus[key];
          }
          return obj; 
        }, {});
        this.isShowStatusKhoTong = true;
      } else {
        this.productStatus = Object.keys(ProductStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
          obj[key] = ProductStatus[key];
          return obj;
        }, {});
        this.isShowStatusKhoTong = false;
      }
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
    })
  }

}
