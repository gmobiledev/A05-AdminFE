import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
import { CollaboratorService } from 'app/auth/service/collaborator.service';

@Component({
  selector: 'app-edit-sell-chanel',
  templateUrl: './edit-sell-chanel.component.html',
  styleUrls: ['./edit-sell-chanel.component.scss'],
  encapsulation: ViewEncapsulation.None

})


export class EditSellChanelComponent implements OnInit {
  onClearHomeProvince() {
    throw new Error('Method not implemented.');
  }
  onClearHomeDistrict() {
    throw new Error('Method not implemented.');
  }

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
  public listMyChanel: any;

  public formGroup;
  public isCreate: boolean = false;
  public submitted: boolean = false;


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
  public titleModal: string;
  public selectedItem: number;

  public listEdit: any;

  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  id;

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
    district_id: '',
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
    private gtalkService: GtalkService,
    private fb: FormBuilder,
    private collaboratorSerivce: CollaboratorService,


  ) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Sửa kho',
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
            name: 'Sửa kho',
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
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.taskService.getListAdmin(this.searchForm).subscribe(res => {
      this.listAdmin = res.data.items;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.userService.getAll(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.listSellUser = res.data.items;
    }, error => {
      this.sectionBlockUI.stop();
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

  async onChangeHomeProvince(id, init = null) {

    try {
      const res = await this.commonDataService.getDistricts(id).toPromise();
      if (res.status == 1) {
        if (!init) {
          this.formGroup.controls['district'].setValue('');
        }
        this.districts = res.data;
        this.commues = []
      }
    } catch (error) {

    }
  }

  async onChangeHomeDistrict(id, init = null) {

    try {
      const res = await this.commonDataService.getCommunes(id).toPromise();
      if (res.status == 1) {
        if (!init) {
          this.formGroup.controls['commune'].setValue('');
        }
        this.commues = res.data
      }
    } catch (error) {

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

    if ((await this.alertService.showConfirm("Bạn có đồng ý sửa kho")).value) {
      this.submittedUpload = true;
      this.inventoryService.updateSellChanel(this.dataSell).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.modalClose();
        this.alertService.showSuccess(res.message);
        this.router.navigate(['/inventory/sell-chanel'], { queryParams: this.searchForm })
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

    this.formGroup = this.fb.group({
      sell_channelid: ['', Validators.required],
      parent_id: ['', Validators.required],
      name: ['', Validators.required],
      code: ['', Validators.required],
      desc: ['', Validators.required],
      type: ['', Validators.required],
      status: ['', Validators.required],
      level: ['', Validators.required],
      business_id: ['', Validators.required],
      admin_id: ['', Validators.required],
      province_id: ['', Validators.required],
      district_id: ['', Validators.required],
      commune_id: ['', Validators.required],
      address: ['', Validators.required],
      isFileChanged: ['', Validators.required],
      attached_file_name: ['', Validators.required],
      attached_file_content: ['', Validators.required],
      customer_id: ['', Validators.required],
    })
  }



  getData() {

    this.commonDataService.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })

    this.inventoryService.getMyChannel(this.searchForm).subscribe(res => {
      this.listMyChanel = res.data.items;
      this.dataSell.parent_id = res.data.parent_id
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    console.log(this.id);
    this.inventoryService.viewDetailSell(this.id).subscribe(res => {
      this.submittedUpload = false;
      if (!res.status) {
        this.alertService.showError(res.message);
        return;
      }
      if (res.data.items[0] && res.data.items[0].province_id) {
        this.onChangeHomeProvince(parseInt(res.data.items[0].province_id), true);
      }
      if (res.data.items[0] && res.data.items[0].district_id) {
        this.onChangeHomeDistrict(parseInt(res.data.items[0].district_id), true);
      }

      this.formGroup.patchValue({
        name: res.data.items[0].name,
        code: res.data.items[0].code,
        desc: res.data.items[0].desc,
        province_id: res.data.items[0] && res.data.items[0].province_id ? parseInt(res.data.items[0].province_id) : '',
        district_id: res.data.items[0] && res.data.items[0].district_id ? parseInt(res.data.items[0].district_id) : '',
        commune_id: res.data.items[0] && res.data.items[0].commune_id ? parseInt(res.data.items[0].commune_id) : '',
        address: res.data.items[0].address,

      })

      this.listEdit = res.data.items;
      this.listUser()


    }, error => {
      this.submittedUpload = false;
      this.alertService.showError(error);
    })


  }

  get f() {
    return this.formGroup.controls;
  }

  async onSubmitCreate() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    let dataPost = {
      sell_channelid: this.formGroup.controls['sell_channelid'].value,
      parent_id: this.formGroup.controls['parent_id'].value,
      name: this.formGroup.controls['name'].value,
      code: this.formGroup.controls['code'].value,
      desc: this.formGroup.controls['desc'].value,
      type: this.formGroup.controls['type'].value,
      status: this.formGroup.controls['status'].value,
      level: this.formGroup.controls['level'].value,
      business_id: this.formGroup.controls['business_id'].value,
      admin_id: this.formGroup.controls['admin_id'].value,
      province_id: this.formGroup.controls['province_id'].value,
      district_id: this.formGroup.controls['district_id'].value,
      commune_id: this.formGroup.controls['commune_id'].value,
      address: this.formGroup.controls['address'].value,
      isFileChanged: this.formGroup.controls['isFileChanged'].value,
      attached_file_name: this.formGroup.controls['attached_file_name'].value,
      attached_file_content: this.formGroup.controls['attached_file_content'].value,
      customer_id: this.formGroup.controls['customer_id'].value,

    }
    if (this.isCreate) {

    } else { 
      // if ((await this.alertService.showConfirm("Bạn có đồng ý sửa kho")).value) {
      //   this.submittedUpload = true;
      //   this.inventoryService.updateSellChanel(dataPost).subscribe(res => {
      //     this.submittedUpload = false;
      //     if (!res.status) {
      //       this.alertService.showError(res.message);
      //       return;
      //     }
      //     this.modalClose();
      //     this.alertService.showSuccess(res.message);
      //     this.router.navigate(['/inventory/sell-chanel'], { queryParams: this.searchForm })
      //   }, error => {
      //     this.submittedUpload = false;
      //     this.alertService.showError(error);
      //   })
      // }
    }
    
  }

}

