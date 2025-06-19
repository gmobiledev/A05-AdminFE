import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { TelecomService } from 'app/auth/service/telecom.service';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { id } from '@swimlane/ngx-datatable';
import { CommonService } from 'app/utils/common.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sell-chanel',
  templateUrl: './sell-chanel.component.html',
  styleUrls: ['./sell-chanel.component.scss']
})
export class SellChanelComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalPage: number;

  public searchForm = {
    id: '',
    name: '',
    code: '',
    desc: '',
    parent_id: '',
    business_id: '',
    type: '',
    status: '',
    admin_id: '',
    admin2_id:'',
    province_id: '',
    district_id: '',
    skip: 0,
    commune_id: '',
    address: '',
    attach_file_name: '',
    customer_id: '',
    user_sell_channels: '',
    page_size: 10,
    page: 1
  }
  public selectedItem: any
  public isCreate: boolean = false;
  public exitsUser: boolean = false;

  public filesData: any;
  public filesImages: any;
  public totalItems: number;

  public currentUser: any;
  public isAdmin: boolean = false;

  @Input() provinces;
  @Input() districts;
  @Input() commues;

  dateRange: any;


  public formGroup: FormGroup;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  count: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private inventoryService: InventoryService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private telecomService: TelecomService,
    private commonDataService: CommonDataService,
    private commonService: CommonService,


  ) {

    this.commonDataService.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })
    
    this.route.queryParams.subscribe(params => {
      this.searchForm.name = params['name'] && params['name'] != undefined ? params['name'] : '';
      this.searchForm.code = params['code'] && params['code'] != undefined ? params['code'] : '';
      this.searchForm.admin_id = params['admin_id'] && params['admin_id'] != undefined ? params['admin_id'] : '';
      this.searchForm.admin2_id = params['admin2_id'] && params['admin2_id'] != undefined ? params['admin2_id'] : '';
      this.searchForm.province_id = params['province_id'] && params['province_id'] != undefined ? params['province_id'] : '';
      this.searchForm.district_id = params['district_id'] && params['district_id'] != undefined ? params['district_id'] : '';
      this.searchForm.commune_id = params['commune_id'] && params['commune_id'] != undefined ? params['commune_id'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';
      this.searchForm.page_size = params['page_size'] && params['page_size'] != undefined ? params['page_size'] : '';

      this.getData();

    })
  }


  loadPage(page): void {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/sell-chanel'], { queryParams: this.searchForm })
  }



  onSubmitSearch(): void {
    this.searchForm.page = 1;
    this.router.navigate(['/inventory/sell-chanel'], { queryParams: this.searchForm })
  }

  async onApprove(item, status ){
    let data = {id : item, status}
    let confirmMessage = status;
    let title = "";


    if (status == 0) {
      confirmMessage = "Bạn có khởi tạo kho?"
      title = "Bạn có đồng ý khởi tạo kho? Nhập lý do"
    } else if (status == 1) {
      confirmMessage = "Bạn có đồng ý kích hoạt kho?"
      title = "Bạn có đồng ý kích hoạt kho? Nhập lý do"
    } else if (status == -2) {
      confirmMessage = "Bạn có đồng ý khóa kho?"
      title = "Bạn có đồng ý khóa kho? Nhập lý do"
    } else if (status == -1) {
      confirmMessage = "Bạn có đồng ý hủy kho này không?"
      title = "Bạn có đồng ý hủy kho?"
    }

    Swal.fire({
      title,
      input: 'textarea',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Xác nhận',
      showLoaderOnConfirm: true,
      preConfirm: (note) => {
        if (!note || note == '') {
          Swal.showValidationMessage(
            "Vui lòng nhập nội dung"
          )
          return;
        }
        data['note'] = note;
        this.inventoryService.lockSell(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showError(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
        }, err => {
          this.alertService.showError(err);
        })  
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {

      }
    })  

  }


  onSubmitExportExcelReport() {
    this.inventoryService.exportExcelReport(this.searchForm).subscribe(res => {
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "Báo cáo kho sim";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách kho',
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
            name: 'Danh sách kho',
            isLink: false
          }
        ]
      }
    };

  }

  onChangeProvince(event) {
    let id = event.target.value
    this.commonDataService.getDistricts(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.districts = res.data
        this.commues = res.data

      }
    })
  }

  onChangeDistrict(event) {
    let id = event.target.value
    this.commonDataService.getCommunes(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.commues = res.data
      }
    })
  }

  getData() {


    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.searchForm.skip = (this.searchForm.page - 1) * this.searchForm.page_size;
    if (this.currentUser && this.currentUser.roles) {
      const arrayRoles = this.currentUser.roles.map(item => { return item.item_name.toLowerCase() });
      if (arrayRoles.includes("admin") || arrayRoles.includes("root")) {
        this.isAdmin = true;
      }
    }

    this.sectionBlockUI.start();
    let paramSerch = { ...this.searchForm }
    for (const key in paramSerch) {
      if (paramSerch[key] == '') {
        delete paramSerch[key];
      }
    }

    this.inventoryService.searchSellChannelAll(paramSerch).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.searchForm.page_size = res.data.page_size;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
      console.log(error);
    })
  }


}
