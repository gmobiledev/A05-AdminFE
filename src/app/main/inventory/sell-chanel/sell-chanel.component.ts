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


@Component({
  selector: 'app-sell-chanel',
  templateUrl: './sell-chanel.component.html',
  styleUrls: ['./sell-chanel.component.scss']
})
export class SellChanelComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    name: '',
    code: '',
    customer_id : '',
    city_id : '',
    district_id : '',
    ward_id: '',
    status: '',
    // commune_id: '',
    // province_id: '',

    page: 1
  }
  public selectedItem: any
  public isCreate: boolean = false;
  public submitted: boolean = false;
  public exitsUser: boolean = false;

  public submittedUpload: boolean = false;
  public filesData: any;
  public filesImages: any;
  public adminId: any;
  public refCode: any;

  public currentUser: any;
  public isAdmin: boolean = false;

  @Input() provinces;
  @Input() districts;
  @Input() commues;
  @Input() countries;

  dateRange: any;

  public residence_districts;
  public residence_commues;
  public home_districts;
  public home_commues;
  public residence;

  public modalRef: any;
  public titleModal: string;
  public formGroup: FormGroup;
  public subFormGroup: FormGroup;
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
    this.route.queryParams.subscribe(params => {
      this.searchForm.name = params['name'] && params['name'] != undefined ? params['name'] : '';
      this.searchForm.code = params['code'] && params['code'] != undefined ? params['code'] : '';
      this.searchForm.customer_id = params['customer_id'] && params['customer_id'] != undefined ? params['customer_id'] : '';
      this.searchForm.city_id = params['city_id'] && params['city_id'] != undefined ? params['city_id'] : '';
      this.searchForm.district_id = params['district_id'] && params['district_id'] != undefined ? params['district_id'] : '';
      this.searchForm.ward_id = params['ward_id'] && params['ward_id'] != undefined ? params['ward_id'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';
      // this.searchForm.commune_id = params['commune_id'] && params['commune_id'] != undefined ? params['commune_id'] : '';
      // this.searchForm.province_id = params['province_id'] && params['province_id'] != undefined ? params['province_id'] : '';

      this.dateRange = null;

      this.getData();
    })
  }

  public dataSell = {
    parent_id: '',
    name: '',
    code: 0,
    desc: '',
    type: 0,
    status: 0,
    business_id: 0,
    admin_id: 0,
    province_id: 0,
    commune_id: 0,
    address: '',
    attached_file_name: '',
    attached_file_content: '',
    customer_id: 0
  }

  loadPage(page): void {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/sell-chanel'], { queryParams: this.searchForm })
  }

  modalOpen(modal, item = null) {
    if (item) {
      this.titleModal = "Cập nhật kênh";
      this.isCreate = false;
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });

    } else {
      this.titleModal = "Thêm kho";
      this.isCreate = true;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }

  modalClose() {
    this.modalRef.close();
    this.initForm();
  }


  onSubmitSearch(): void {
    this.searchForm.page = 1;
    this.router.navigate(['/inventory/sell-chanel'], { queryParams: this.searchForm })
  }

  onFocusMobile() {
    this.exitsUser = false;
    this.titleModal = "Thêm đại lý";
  }

  async onSubmitCreate() {
    console.log("onSubmitCreate");
  }

  async onFileChangeExcel(event) {
    this.filesData = event.target.files[0];
  }

  async onFileChangeImages(event) {
    this.filesImages = event.target.files[0];
  }

  async onSubmitLock(id, status) {
    const confirmMessage = status ? "Bạn có đồng ý khóa kho?" : "Bạn có đồng ý mở khóa kho?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.inventoryService.lockSell(id, status).subscribe(res => {
        if (!res.status) {
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

  async onAcivteSell(id, status) {
    const confirmMessage = status ? "Bạn có đồng ý kích hoạt kho?" : "Bạn có đồng ý dừng kích hoạt kho?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.inventoryService.activeSell(id, status).subscribe(res => {
        if (!res.status) {
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


  async onSubmitUpload() {
    if (!this.filesData || !this.filesImages || !this.adminId) {
      this.alertService.showError("Vui lòng nhập đủ dữ liệu");
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true;
      const formData = new FormData();
      formData.append("files", this.filesData);
      formData.append("batch_id", this.selectedItem.id);

      console.log(this.filesData, this.selectedItem.id, formData)

      this.inventoryService.uploadFileBatch(formData).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.filesData = null;
        this.filesImages = null;
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  async onSelectFileAccount(event) {
    this.filesData = event.target.files[0];
  }

  async onSubmitUploadCCCD() {

    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true;

      const formData = new FormData();
      formData.append("file", this.filesData);

      this.telecomService.assignNumberBatch(formData).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  async onFileChangeAttach(event) {
    if (event.target.files && event.target.files[0]) {
      const ext = event.target.files[0].type;
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.dataSell.attached_file_name = 'png';
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.dataSell.attached_file_name = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.dataSell.attached_file_name = 'pdf';
        this.dataSell.attached_file_name = (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '');
      }
    }
  }

  onSubmitExportExcelReport() {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000;
    // const daterangeString = this.dateRange.startDate && this.dateRange.endDate
    //   ? (new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) + '|' + (new Date(new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset)).toISOString().slice(0, 10) : '';
    // this.searchForm.date_range = daterangeString;
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

  async onSubmitUploadSell() {

    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true; 
      this.inventoryService.addSellChanel(this.dataSell).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách kho sim số',
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
            name: 'Danh sách kho sim số',
            isLink: false
          }
        ]
      }
    };

    this.initForm();
  }

  get f() {
    return this.formGroup.controls;
  }

  initForm() {

  }

  onChangeProvince(event) {
    let id = event.target.value
    this.commonDataService.getDistricts(id).subscribe((res: any) => {
      if (res.status == 1) {
        this.districts = res.data

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
    this.commonDataService.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (this.currentUser && this.currentUser.roles) {
      const arrayRoles = this.currentUser.roles.map(item => { return item.item_name.toLowerCase() });
      if (arrayRoles.includes("admin") || arrayRoles.includes("root")) {
        this.isAdmin = true;
      }
    }
    this.sectionBlockUI.start();
    this.inventoryService.searchSellChannelAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalPage = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }


}
