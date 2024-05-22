import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { AdminChannelAction, FIX_ROLE } from 'app/utils/constants';
import { AdminService } from 'app/auth/service/admin.service';

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

  @ViewChild('modalAttachments') modalAttachments;


  public modalRef: any;
  @Input() provinces;
  @Input() districts;
  @Input() commues;

  public submittedUpload: boolean = false;
  public currentUser: any;
  public isAdmin: boolean = false;
  public listMyChanel: any;

  public formGroup;
  public isCreate: boolean = false;
  public submitted: boolean = false;
  parentLevel;

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
  listFiles = [];
  fileExt;
  listAdminSellAction;

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
    private adminService: AdminService

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
    this.inventoryService.getAdminsSell({channel_id: this.id}).subscribe(res => {
      this.listAdminSellAction = res.data;
      const approval1 = this.listAdminSellAction.find(x => x.action == AdminChannelAction.APPROVE_EXPORT_LEVEL11);
      const approval2 = this.listAdminSellAction.find(x => x.action == AdminChannelAction.APPROVE_EXPORT_LAST);
      const createExport = this.listAdminSellAction.find(x => x.action == AdminChannelAction.CREATE_EXPORT);
      if(approval1) {
        this.formGroup.patchValue({
          approval_1: approval1.admin_id
        })
      }
      if(approval2) {
        this.formGroup.patchValue({
          approval_2: approval2.admin_id
        })
      }
      if(createExport) {
        this.formGroup.patchValue({
          create_export: createExport.admin_id
        })
      }
    })
  }

  async listUser() {
    this.taskService.getListCustomer({}).subscribe(res => {
      this.listCustomer = res.data.items;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.taskService.getListAdmin({}).subscribe(res => {
      this.listAdmin = res.data.items;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })

    this.userService.getAll({}).subscribe(res => {
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
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
          this.formGroup.patchValue({
          attached_file_name: event.target.files[0].name,
        });
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.formGroup.patchValue({
          attached_file_content: (img + '').replace('data:image/png;base64,', '')
        });
      } else if (ext.includes('pdf')) {
        this.formGroup.patchValue({
          attached_file_name: event.target.files[0].name,
        });
        this.formGroup.patchValue({
          attached_file_content: (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '')
        });
      }
    }
  }


  async onChangeHomeProvince(id, init = null) {

    try {
      const res = await this.commonDataService.getDistricts(id).toPromise();
      if (res.status == 1) {
        if (!init) {
          this.formGroup.controls['district_id'].setValue('');
          this.formGroup.controls['commune_id'].setValue('');

        }
        this.districts = res.data;
        // this.commues = []
      }
    } catch (error) {

    }
  }

  async onChangeHomeDistrict(id, init = null) {

    try {
      const res = await this.commonDataService.getCommunes(id).toPromise();
      if (res.status == 1) {
        if (!init) {
          this.formGroup.controls['commune_id'].setValue('');
        }
        this.commues = res.data
      }
    } catch (error) {

    }
  }

  onViewAttachments() {
    let files = this.formGroup.attached_file_name ? JSON.parse(this.formGroup.attached_file_name) : null;
    if(files && files.file) {
      this.inventoryService.viewFile({
        file: files.file
      }).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.listFiles = [
          {ext: res.data.ext, base64: res.data.base64}
        ];
        this.onViewModalApprove(this.modalAttachments);
      },error => {
        this.alertService.showMess(error);
      })
    } else {
      this.onViewModalApprove(this.modalAttachments);
    }    
    
  }

  onViewModalApprove(modal) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }


  initForm() {

    this.formGroup = this.fb.group({
      id: ['', Validators.required],
      sell_channelid: ['', Validators.required],
      quantity: ['', Validators.required],
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
      customer_id: [''],
      approval_1: [''],
      approval_2: [''],
      create_export: [''],
    })
  }

  onClearApproval1() {
    this.formGroup.patchValue({
      approval_1: -1
    })
  }

  getData() {

    this.commonDataService.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })

    console.log(this.id);
    this.inventoryService.viewDetailSell(this.id).subscribe(res => {
      this.inventoryService.getMyChannel({}).subscribe(res1 => {
        this.listMyChanel = res1.data.items;
        const parent = this.listMyChanel.find(x => x.id == res.data.items[0].parent_id)
        this.parentLevel = parent.level;
        // this.formGroup.parent_id = res.data.parent_id;
      }, error => {
        console.log("ERRRR");
        console.log(error);
      })

      this.submittedUpload = false;
      this.fileExt = 'pdf';
      let files = res.data.items[0].attached_file_name ? JSON.parse(res.data.items[0].attached_file_name) : null;
      if (files && files.file) {
        const arrayFileExt = files.file.split('.');
        this.fileExt = arrayFileExt[arrayFileExt.length - 1];
      } else {
        this.fileExt = '';
      }
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
        id: res.data.items[0].id,
        name: res.data.items[0].name,
        code: res.data.items[0].code,
        desc: res.data.items[0].desc,
        parent_id: res.data.items[0].parent_id,
        quantity: res.data.items[0].quantity,
        admin_id: res.data.items[0].admin_id,
        attached_file_content: res.data.items[0].attached_file_content,
        attached_file_name: res.data.items[0].attached_file_name,
        business_id: res.data.items[0].business_id,
        customer_id: res.data.items[0].customer_id,
        isFileChanged: res.data.items[0].isFileChanged,
        level: res.data.items[0].level,
        status: res.data.items[0].status,
        type: res.data.items[0].type,
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
    // if (this.formGroup.invalid) {
    //   console.log('validate')
    //   return;
    // }
    let dataPost = {
      id: this.formGroup.controls['id'].value,
      sell_channelid: this.formGroup.controls['sell_channelid'].value,
      parent_id: this.formGroup.controls['parent_id'].value,
      name: this.formGroup.controls['name'].value,
      code: this.formGroup.controls['code'].value,
      desc: this.formGroup.controls['desc'].value,
      type: this.formGroup.controls['type'].value,
      quantity: this.formGroup.controls['quantity'].value,
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
      approval_1: this.formGroup.controls['approval_1'].value,
      approval_2: this.formGroup.controls['approval_2'].value,
      create_export: this.formGroup.controls['create_export'].value,

    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý sửa kho")).value) {
      this.submittedUpload = true;
      this.inventoryService.updateSellChanel(dataPost).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }

        // if (this.parentLevel < 2) {
          const createExportAdId = dataPost.create_export ? dataPost.create_export : dataPost.admin_id;
          this.adminService.addRoleInventory(createExportAdId, [
            { item_name: FIX_ROLE.TAO_THU_HOI_KHO, user_id: createExportAdId },
            { item_name: FIX_ROLE.TAO_XUAT_KHO, user_id: createExportAdId },
          ]).subscribe(res => {

          })

          if (dataPost.approval_1 && dataPost.approval_1.value != -1) {
            this.adminService.addRoleInventory(dataPost.approval_1, [
              { item_name: FIX_ROLE.DUYET_THU_HOI_KHO, user_id: dataPost.approval_1 },
              { item_name: FIX_ROLE.DUYET_XUAT_KHO, user_id: dataPost.approval_1 }
            ]).subscribe(res => {

            })
          }
          if (dataPost.approval_2) {
            this.adminService.addRoleInventory(dataPost.approval_2, [
              { item_name: FIX_ROLE.DUYET_THU_HOI_KHO, user_id: dataPost.approval_2 },
              { item_name: FIX_ROLE.DUYET_XUAT_KHO, user_id: dataPost.approval_2 }
            ]).subscribe(res => {

            })
          }
        // }        

        this.alertService.showSuccess(res.message);
        this.router.navigate(['/inventory/sell-chanel'])
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }


  }

}

