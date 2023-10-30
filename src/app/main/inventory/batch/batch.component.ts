import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { CreateAgentDto } from 'app/auth/service/dto/user.dto';
import { InventoryService } from 'app/auth/service/inventory.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss']
})
export class BatchComponent implements OnInit {

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
    page: 1,
    page_size: 20,
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

  public title: string;
  public quantility: any;
  public channel_id: any;
  public note: string;

  public dataLo = {
    title: '',
    quantility: 0,
    channel_id: 0,
    files: '',
    note: ''
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private inventoryService: InventoryService,
    private telecomService: TelecomService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
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
      this.titleModal = "Tải dữ liệu của lô";
      this.isCreate = false;
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });

    } else {
      this.titleModal = "Thêm lô";
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
    this.router.navigate(['/inventory/batch'], { queryParams: this.searchForm })
  }

  onFocusMobile() {
    this.exitsUser = false;
    this.titleModal = "Thêm đại lý";
  }

  async onFileChangeExcel(event) {
    this.filesData = event.target.files[0];
  }

  async onFileChangeImages(event) {
    this.filesImages = event.target.files[0];
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

      console.log(this.filesData, this.selectedItem.id,formData)
    
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

  async onSubmitUploadLo() {

    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true; 
      this.inventoryService.uploadBatchSim(this.dataLo).subscribe(res => {
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
      headerTitle: 'Danh sách lô',
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
            name: 'Danh sách lô',
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

  async onSubmitUploadFileAccount() {
    if (!this.fileAccount || !this.adminId) {
      this.alertService.showError("Vui lòng nhập đủ dữ liệu");
      return;
    }
    if(!this.channelId) {
      this.alertService.showError("Vui lòng chọn kênh bán");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true;
      const formData = new FormData();
      formData.append("files", this.fileAccount);
      formData.append("admin_id", this.adminId ? this.adminId : null);
      formData.append("ref_code", this.refCode ? this.refCode : null);
      
      this.userService.createAgentBatchAccount(formData).subscribe(async res => {
        this.submittedUpload = false;
        if (!res.status) {
          await this.alertService.showMess(res.message);
          return;
        }
        this.fileAccount = null;
        const dataSellChannel = {
          channel_id: this.channelId,
          user_id: res.data.user_id
        }
        this.telecomService.sellChannelAddUser(dataSellChannel).subscribe(resS => {
          if (!resS.status) {
            this.alertService.showError(resS.message);
            return;
          }
        })
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      // ref_code: [],
      // service_code: new FormArray([]),
      agents_service: this.formBuilder.array([]),
      new_agents_service: this.formBuilder.array([])
    });
    this.exitsUser = false;
    this.isCreate = true;
  }

  async onListChannel(){
    this.inventoryService.findChannelAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.listChannel = res.data.items;
      
    }, error => {
      this.sectionBlockUI.stop();
    })
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (this.currentUser && this.currentUser.roles) {
      const arrayRoles = this.currentUser.roles.map(item => { return item.item_name.toLowerCase() });
      if (arrayRoles.includes("admin") || arrayRoles.includes("root")) {
        this.isAdmin = true;
      }
    }
    this.sectionBlockUI.start();
    this.inventoryService.findBatchAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.totalItems = res.data.count;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })

    this.onListChannel();

  }


}
