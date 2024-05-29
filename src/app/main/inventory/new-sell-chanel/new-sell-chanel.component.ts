import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
import { TaskService } from 'app/auth/service/task.service';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { AdminService } from 'app/auth/service/admin.service';
import { FIX_ROLE } from 'app/utils/constants';

@Component({
  selector: 'app-new-sell-chanel',
  templateUrl: './new-sell-chanel.component.html',
  styleUrls: ['./new-sell-chanel.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class NewSellChanelComponent implements OnInit {

  onClearProvince() {
    throw new Error('Method not implemented.');
  }
  onClearDistrict() {
    throw new Error('Method not implemented.');
  }

  public modalRef: any;
  @Input() provinces;
  @Input() districts;
  @Input() commues;
  @Input() countries;

  public submittedUpload: boolean = false;
  public currentUser: any;

  public isAdmin: boolean = false;

  public searchForm = {
    keyword: '',
    status: '',
    nameSell: '',
    nameChanel: '',
    codeSell: '',
    page: 1
  }

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  count: any;
  public contentHeader: any;
  public list: any;

  public listCustomer: any;
  public listAdmin: any;
  public listSellUser: any;
  public listMyChanel: any;

  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  parentLevel;

  public dataSell = {
    parent_id: '',
    name: '',
    code: '',
    desc: '',
    type: 0,
    status: 0,
    quantity: '',
    business_id: 0,
    admin_id: 0,
    province_id: '',
    commune_id: '',
    district_id:'',
    address: '',
    attached_file_name: '',
    attached_file_content: '',
    customer_id: 0,
    create_export: 0,
    create_retrieve: 0,
    approval_1: 0,
    approval_2: 0,
  }

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
    private taskService: TaskService,
    private gtalkService: GtalkService,
    private adminService: AdminService

  ) {
    this.getData();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Tạo kho',
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
            name: 'Tạo kho',
            isLink: false
          }
        ]
      }
    };

  }

  async listUser() {

    this.taskService.getListCustomer(this.searchForm).subscribe(res => {
      this.listCustomer = res.data.items;
      console.log("1",this.listCustomer);
    }, error => {
      console.log(error);
    })

    this.taskService.getListAdmin(this.searchForm).subscribe(res => {
      this.listAdmin = res.data.items;
      console.log("2",this.listAdmin);
    }, error => {
      console.log(error);
    })

    this.inventoryService.getMyChannel(this.searchForm).subscribe(res => {
      this.listMyChanel = res.data.items;
      console.log("3",this.listMyChanel);
      this.parentLevel = this.listMyChanel[0].level;
    }, error => {
      console.log(error);
    })


    this.userService.getAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.listSellUser = res.data.items;
      console.log("4",this.listSellUser);
    }, error => {
      this.sectionBlockUI.stop();
      console.log(error);
    })
  }


  async onFileChangeAttach(event) {
    if (event.target.files && event.target.files[0]) {
      const ext = event.target.files[0].type;
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.dataSell.attached_file_name = event.target.files[0].name;
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.dataSell.attached_file_content = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.dataSell.attached_file_name = event.target.files[0].name;
        this.dataSell.attached_file_content = (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '');
      }
    }
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

  onClearApproval1() {
    this.dataSell.approval_1 = -1;
  }

  async onSubmitUploadSell() {

    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo kho không?")).value) {
      this.submittedUpload = true;
      console.log("data Sell = ",this.dataSell);
      this.inventoryService.addSellChanel(this.dataSell).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }

        // if (this.parentLevel < 2) {
          const createExportAdId = this.dataSell.create_export ? this.dataSell.create_export : this.dataSell.admin_id;
          this.adminService.addRoleInventory(createExportAdId, [
            { item_name: FIX_ROLE.TAO_THU_HOI_KHO, user_id: createExportAdId },
            { item_name: FIX_ROLE.TAO_XUAT_KHO, user_id: createExportAdId },
          ]).subscribe(res => {

          })
          if (this.dataSell.approval_1 && this.dataSell.approval_1 != -1) {
            this.adminService.addRoleInventory(this.dataSell.approval_1, [
              { item_name: FIX_ROLE.DUYET_THU_HOI_KHO, user_id: this.dataSell.approval_2 },
              { item_name: FIX_ROLE.DUYET_XUAT_KHO, user_id: this.dataSell.approval_2 }
            ]).subscribe(res => {

            })
          }
          if (this.dataSell.approval_2) {
            this.adminService.addRoleInventory(this.dataSell.approval_2, [
              { item_name: FIX_ROLE.DUYET_THU_HOI_KHO, user_id: this.dataSell.approval_2 },
              { item_name: FIX_ROLE.DUYET_XUAT_KHO, user_id: this.dataSell.approval_2 }
            ]).subscribe(res => {

            })
          }
        // }

        this.alertService.showSuccess(res.message);
        this.router.navigate(['/inventory/sell-chanel'])
        
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  modalClose() {
    this.modalRef.close();
  }

  onChangeParent() {
    const parent = this.listMyChanel.find(x => x.id == parseInt(this.dataSell.parent_id));
    this.parentLevel = parent.level;
  }

  getData() {
    
    this.listUser()

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
  }


}
