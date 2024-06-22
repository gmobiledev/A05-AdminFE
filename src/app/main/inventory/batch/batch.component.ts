import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { CreateAgentDto } from 'app/auth/service/dto/user.dto';
import { InventoryService } from 'app/auth/service/inventory.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { CommonService } from 'app/utils/common.service';
import { AdminChannelAction, BatchStatus, BatchType } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BatchComponent implements OnInit {

  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @BlockUI('item-block-detail') itemBlockDetailUI: NgBlockUI;

  @Input() inventoryType: string;
  public contentHeader: any;
  public list: any;
  public listChannel: any;
  public totalItems: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: '',
    type: '',
    page: 1,
    page_size: 20,
    from_date: '',
    to_date: ''
  }
  public selectedItem: any
  public isCreate: boolean = false;
  public submitted: boolean = false;
  public exitsUser: boolean = false;

  public submittedUpload: boolean = false;
  public filesData: any;
  public filesImages: any;
  public fileAttachment: any;

  public adminId: any;
  public refCode: any;

  public batchdDetail: any
  public itemBatch: any
  public batchStatus = BatchStatus;
  public batchType = BatchType;
  public listCurrentAction: any;
  public batchStatusShow;
  public basicSelectedOption = 20;
  public listProductInputDup = [];
  public listDupToExport = [];

  public dataLo = {
    title: '',
    quantility: 0,
    // channel_id: 0,
    files: '',
    file_ext: '',
    note: '',
    product_code: '',
    product_name: '',
    unit: '',
    key_from: '',
    key_to: '',
    is_force_push: true,
  }

  public currentUser: any;
  public isAdmin: boolean = false;

  public fileAccount: any;
  public channelId: any;

  public modalRef: any;
  public titleModal: string;
  public formGroup: FormGroup;
  public subFormGroup: FormGroup;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  count: any;
  public checkDup: boolean = false;
  listAdminSellAction;
  listAdminSellActionCurrent;
  listAction = AdminChannelAction;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private inventoryService: InventoryService,
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.from_date = params['from_date'] && params['from_date'] != undefined ? params['from_date'] : '';
      this.searchForm.to_date = params['to_date'] && params['to_date'] != undefined ? params['to_date'] : '';
      this.searchForm.type = params['type'] && params['type'] != undefined ? params['type'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;

      this.getData();
    })
  }
  loadPage(page): void {
    this.searchForm.page = page;
    this.router.navigate(['/inventory/batch'], { queryParams: this.searchForm })
  }

  modalOpen(modal, item = null) {
    if (item) {
      this.inventoryService.getAdminsSell({channel_id: item.channel_id}).subscribe(res => {
        this.listAdminSellAction = res.data;
      })
      this.titleModal = "Tải dữ liệu";
      this.isCreate = false;
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });

    } else {
      this.titleModal = "Tạo phiếu nhập";
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
    this.listDupToExport = [];
    this.listProductInputDup = [];
    this.dataLo = {
      title: '',
      quantility: 0,      
      files: '',
      file_ext: '',
      note: '',
      product_code: '',
      product_name: '',
      unit: '',
      key_from: '',
      key_to: '',
      is_force_push: true,
    }
    this.getData();
  }

  onViewDetail(modal, item) {
    this.batchdDetail = item;
    this.sectionBlockUI.start();
    this.inventoryService.detailBatchSim(item.id).subscribe(res => {
      this.sectionBlockUI.stop();
      if (res.status && res.data) {
        this.itemBatch = res.data;
      }
      this.inventoryService.getAdminsSellKhoTong({batch_id: item.id}).subscribe(res => {
        this.listAdminSellAction = res.data;
      })
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }, error => {
      this.sectionBlockUI.stop();
      this.alertService.showError(error);
    })
  }

  async onUpdateStatus(item, status) {
    let data = {
      id: item.id,
      status: status,
    }

    let confirmMessage = "";
    if (status == this.batchStatus.APPROVED || status == this.batchStatus.APPROVED_BY_ACCOUNTANT) {
      confirmMessage = 'Bạn có đồng ý Xác nhận duyệt?'
    } else if (status == this.batchStatus.COMPLETED) {
      confirmMessage = 'Bạn có đồng ý Xác đã hoành thành?'
    } else if (status == this.batchStatus.CANCEL_BY_ACCOUNTANT || status == this.batchStatus.CANCEL_BY_OFFICE) {
      confirmMessage = 'Bạn có đồng ý từ chối?'
    }

    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      if(status == this.batchStatus.APPROVED_BY_ACCOUNTANT
        || status == this.batchStatus.CANCEL_BY_ACCOUNTANT
        ) {
        this.inventoryService.ktUpdateStatusBatchInput(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.modalClose();
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }
      if(status == this.batchStatus.APPROVED
        || status == this.batchStatus.CANCEL_BY_OFFICE
        ) {
        this.inventoryService.vpUpdateStatusBatchInput(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.modalClose();
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      } 
      if(status == this.batchStatus.COMPLETED) {
        this.inventoryService.updateStatusBatchInputComplete(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.modalClose();
          this.getData();
          this.alertService.showSuccess(res.message);
        }, error => {
          this.alertService.showMess(error);
          return;
        })
      }
    }

  }

  onSubmitSearch(): void {
    this.searchForm.page = 1;
    this.router.navigate(['/inventory/batch'], { queryParams: this.searchForm })
  }

  onFocusMobile() {
    this.exitsUser = false;
    this.titleModal = "Thêm đại lý";
  }

  async onFileChangeExcel(event) {
    this.filesData = event.target.files[0];

    //check trung
    this.itemBlockUI.start();
    let formData = new FormData();
    formData.append("files", this.filesData);
    this.inventoryService.checkProductStore(formData).subscribe(res => {
      this.itemBlockUI.stop();
      if (!res.data.success && res.data.data && res.data.data.length > 0) {
        this.listProductInputDup = res.data.data;
        this.listDupToExport = res.data.data.map(item => {
          return {
            'Name': item.name,
            'Nhà mạng': item.brand,
            'Hạng số': item.level,
            'Giá vốn': item.price,
            'Giá bán': item.export_price
          }
        })
      }
      
    }, error => {
      this.itemBlockUI.stop();
    })
  }

  async onFileChangeImages(event) {
    this.filesImages = event.target.files[0];
  }

  async onFileChangeAttach(event) {
    if (event.target.files && event.target.files[0]) {
      const ext = event.target.files[0].type;
      this.fileAttachment = event.target.files[0];
      // if (ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
      //   this.dataLo.file_ext = 'png';
      //   let img = await this.commonService.resizeImage(event.target.files[0]);
      //   this.dataLo.files = (img + '').replace('data:image/png;base64,', '')
      // } else if (ext.includes('pdf')) {
      //   this.dataLo.file_ext = 'pdf';
      //   this.dataLo.files = (await this.commonService.fileUploadToBase64(event.target.files[0]) + '').replace('data:application/pdf;base64,', '');
      // }
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

  //Tạo lo nhập kho tổng
  async onSubmitUploadLo() {
    if(!this.fileAttachment) {
      this.alertService.showMess("Vui lòng đính kèm chứng từ");
      return;
    }
    if(!this.filesData) {
      this.alertService.showMess("Vui lòng chọn file danh sách sản phẩm");
      return;
    }
    let formData = new FormData();
    for(let key in this.dataLo) {
      formData.append(key, this.dataLo[key]);
    }
    formData.append("excel_upload_files", this.filesData);
    formData.append("files_attachment", this.fileAttachment);
    
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo yêu cầu nhập kho")).value) {
      this.submittedUpload = true;
      this.itemBlockUI.start();
      this.inventoryService.createBatchInputV2(formData).subscribe(res => {
        this.itemBlockUI.stop();
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.itemBlockUI.stop();
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách phiếu',
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
            name: 'Danh sách phiếu',
            isLink: false
          }
        ]
      }
    };

  }

  get f() {
    return this.formGroup.controls;
  }

  async onListChannel() {
    // this.inventoryService.findChannelAll(this.searchForm).subscribe(res => {
    //   this.sectionBlockUI.stop();
    //   this.listChannel = res.data.items;

    // }, error => {
    //   this.sectionBlockUI.stop();
    // })
  }

  getData() {
    this.batchStatusShow = Object.keys(BatchStatus).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
      obj[key] = BatchStatus[key];
      return obj;
    }, {});
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (this.currentUser && this.currentUser.roles) {
      const arrayRoles = this.currentUser.roles.map(item => { return item.item_name.toLowerCase() });
      if (arrayRoles.includes("admin") || arrayRoles.includes("root")) {
        this.isAdmin = true;
      }
    }
    this.listCurrentAction = this.currentUser.actions;
    let paramSearch = {...this.searchForm};
    for(let key in paramSearch) {
      if(paramSearch[key] === '') {
        delete paramSearch[key];
      }
    }
    this.inventoryService.getAdminsSell({user_id: this.currentUser.id}).subscribe(res => {
      this.listAdminSellActionCurrent = res.data;
    })
    this.sectionBlockUI.start();
    if(this.checkAction('staff/list')) {
      this.inventoryService.findBatchStaff(paramSearch).subscribe(res => {
        this.sectionBlockUI.stop();
        this.list = res.data.items;
        this.totalItems = res.data.count;
      }, error => {
        this.sectionBlockUI.stop();
        console.log("ERRRR");
        console.log(error);
      });
    } else {
      this.inventoryService.findBatchUser(paramSearch).subscribe(res => {
        this.sectionBlockUI.stop();
        this.list = res.data.items;
        this.totalItems = res.data.count;
      }, error => {
        this.sectionBlockUI.stop();
        console.log("ERRRR");
        console.log(error);
      })
    }
    

    this.onListChannel();

  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

  // checkSellAdminAction(action) {
  //   return this.listAdminSellAction.find(x => x.admin_id == this.currentUser.id && x.action == action) ? true : false
  // }

  checkSellAdminAction(action, has = false) {
    if(has) {
      return !this.listAdminSellAction.find(x => x.action == action ) || this.listAdminSellAction.find(x => (x.admin_id == this.currentUser.id || x.admin_id == this.batchdDetail.created_by ) && x.action == action) ? true : false
    }
    return this.listAdminSellAction.find(x => x.admin_id != this.batchdDetail.created_by && x.action == action) ? true : false
  }

  checkHasPermissionAction(list, action) {
    return list.find(x => x.admin_id == this.currentUser.id && x.action == action) ? true : false
  }

  async onUploadAttachments(event) {
    const file = event.target.file;
    let formData = new FormData();
    for(let item of event.target.files) {
      formData.append("files", item);
    }
    formData.append("id", this.batchdDetail.id)
    if ((await this.alertService.showConfirm('Bạn có đồng ý tải lên các file?')).value) {
      this.inventoryService.uploadAttachmentBatch(formData).subscribe(res => {
        this.getData();
        this.alertService.showSuccess(res.message);
      }, error => {
        this.alertService.showMess(error)
      })
    }
  }

}
