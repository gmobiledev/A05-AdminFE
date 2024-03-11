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
import { TaskService } from 'app/auth/service/task.service';

@Component({
  selector: 'app-new-sell-chanel',
  templateUrl: './new-sell-chanel.component.html',
  styleUrls: ['./new-sell-chanel.component.scss']
})
export class NewSellChanelComponent implements OnInit {

  public modalRef: any;
  @Input() provinces;
  @Input() districts;
  @Input() commues;
  @Input() countries;

  public submittedUpload: boolean = false;
  public currentUser: any;

  public residence_districts;
  public residence_commues;
  public home_districts;
  public home_commues;
  public residence;
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

  public totalPage: number;
  public page: number = 1;
  public pageSize: number;

  public dataSell = {
    parent_id: '',
    name: '',
    code: 0,
    desc: '',
    type: 0,
    status: 0,
    business_id: 0,
    admin_id: 0,
    province_id: '',
    commune_id: '',
    district_id:'',
    address: '',
    attached_file_name: '',
    attached_file_content: '',
    customer_id: 0
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

  ) {
    this.getData();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Thêm kho',
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
            name: 'Thêm kho',
            isLink: false
          }
        ]
      }
    };

    this.initForm();
  }

  async listUser() {
    this.taskService.getListCustomer(this.searchForm).subscribe(res => {
      this.listCustomer = res.data.items;
      // this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.taskService.getListAdmin(this.searchForm).subscribe(res => {
      this.listAdmin = res.data.items;
      // this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }


  async onFileChangeAttach(event) {
    if (event.target.files && event.target.files[0]) {
      const ext = event.target.files[0].type;
      if (ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.dataSell.attached_file_name = 'png';
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.dataSell.attached_file_name = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.dataSell.attached_file_name = 'pdf';
        this.dataSell.attached_file_name = (await this.commonService.fileUploadToBase64(event.target.files[0]) + '').replace('data:application/pdf;base64,', '');
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

  modalClose() {
    this.modalRef.close();
    this.initForm();
  }


  initForm() {

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
    this.sectionBlockUI.start();
    this.inventoryService.findSellChannelAll(this.searchForm).subscribe(res => {
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

  modalOpen(modal, item = null) {
  //     if(item) {
  //       this.titleModal = "Cập nhật user";
  //       this.isCreate = false;
  //       this.selectedUserId = item.id;
  //       this.userService.getAgentServices(item.id).subscribe(res => {


  //         this.currentService = res.data.map( x => { return { id: x.id, status: x.status, ref_code: x.referal_code, service_code: x.type } });
  //         let arrayControl = <FormArray>this.formGroup.controls['agents_service'];
  //         for (let i = 0; i < this.currentService.length; i++ ) {
  //           const newGroup = this.formBuilder.group({
  //             id: [{value:this.currentService[i]['id'], disabled: true}],
  //             status: [{value:this.currentService[i]['status'], disabled: true}],
  //             ref_code: [{value: this.currentService[i]['ref_code'], disabled: true}],
  //             service_code: [{value: this.currentService[i]['service_code'], disabled: true}]
  //           });
  //           const index = this.listServiceFilter.findIndex(item => item.code == this.currentService[i]['service_code']);
  //           this.listServiceFilter[index]['disabled'] = 'disabled';
  //           arrayControl.push(newGroup);
  //         }

  //         this.modalRef = this.modalService.open(modal, {
  //           centered: true,
  //           windowClass: 'modal modal-primary',
  //           size: 'lg'
  //         });
  //       })
  //     } else {
  //       this.titleModal = "Thêm đại lý";
  //       this.isCreate = true;
  //       this.modalRef = this.modalService.open(modal, {
  //         centered: true,
  //         windowClass: 'modal modal-primary',
  //         size: 'lg'
  //       });
  //     }
  }

}
