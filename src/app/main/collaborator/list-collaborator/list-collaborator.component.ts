import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { CollaboratorService } from 'app/auth/service/collaborator.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-list-collaborator',
  templateUrl: './list-collaborator.component.html',
  styleUrls: ['./list-collaborator.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListCollaboratorComponent implements OnInit {

  public contentHeader = {
    headerTitle: 'Danh sách CTV',
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
          name: 'Danh sách CTV',
          isLink: false
        }
      ]
    }
  };
  public searchForm = {
    mobile: '',
    id_no: '',
    name: '',
    page: 1,
  }
  public isCreate: boolean = false;
  public submitted: boolean = false;  
  public titleModal: string;
  public selectedItem: number;
  public list: any;
  public page: any;
  public total: any;
  public pageSize: any = 20;
  public formGroup;
  public modalRef: any;
  public provinces = []
  public districts = []
  public commues = []

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminSerivce: AdminService,
    private alertService: SweetAlertService,
    private collaboratorSerivce: CollaboratorService,
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
    this.initForm();
    this.getProvinces();
    this.getData()
  }

  onSubmitSearch(): void {
    this.router.navigate(['/collaborator'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/collaborator'], { queryParams: this.searchForm })
  }

  getProvinces() {
    this.adminSerivce.getProvinces().subscribe((res: any) => {
      if (res.status == 1) {
        this.provinces = res.data
      }
    })
  }

  async onChangeHomeProvince(id, init = null) {  
    if(this.provinces.length > 0) {
      // this.residence['province'] = (this.provinces.find(item => item.id == id)).title;
    }    
    try {
      const res = await this.adminSerivce.getDistricts(id).toPromise();
      if (res.status == 1) {
        if(!init) {
          this.formGroup.controls['district'].setValue('');
        }
        this.districts = res.data;
        this.commues = []
      }
    } catch (error) {

    }
  }

  async onChangeHomeDistrict(id, init = null) {
    if(this.districts.length > 0) {
      // this.residence['district'] = (this.districts.find(item => item.id == id)).title;
    }
    try {
      const res = await this.adminSerivce.getCommunes(id).toPromise();
      if (res.status == 1) {
        if(!init) {
          this.formGroup.controls['commune'].setValue('');
        }
        this.commues = res.data
      }
    } catch (error) {

    }
  }

  onChangeResidenceCommune(event) {
    if(this.commues.length > 0) {
      // this.residence['commune'] = (this.commues.find(item => item.id == event)).title;
    }
  }

  initForm() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      customer_id: [10],
      phone_mobile: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      commune: ['', Validators.required],
      address_street: [''],
    })
  }

  getData(): void {
    this.collaboratorSerivce.getAll(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

  modalOpen(modal, item = null) { 
    if(item) {
      this.titleModal = "Cập nhật CTV";
      this.isCreate = false;
      this.selectedItem = item.id;
      this.onChangeHomeProvince(parseInt(item.contact.province), true);
      this.onChangeHomeDistrict(parseInt(item.contact.district), true);
      
      this.formGroup.patchValue({
        name: item.name,
        code: item.code, 
        customer_id: item.customer_id,
        province: parseInt(item.contact.province),
        district: parseInt(item.contact.district),
        commue: parseInt(item.contact.commue),
        phone_mobile: item.contact.phone_mobile,
        address_street: item.contact.address_street    
      })

      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    } else {
      this.titleModal = "Thêm CTV";
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

  onSubmitCreate() {
    let dataPost = {
      name: this.formGroup.controls['name'].value,
      code: this.formGroup.controls['code'].value,
      customer_id: this.formGroup.controls['customer_id'].value,
      contact: {
        province: this.formGroup.controls['province'].value,
        district: this.formGroup.controls['district'].value,
        commune: this.formGroup.controls['commune'].value,
        address_street: this.formGroup.controls['address_street'].value,
        phone_mobile: this.formGroup.controls['phone_mobile'].value 
      }
    }
    if(this.isCreate) {
      this.collaboratorSerivce.create(dataPost).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return
        }
        this.alertService.showSuccess(res.message);
        this.getData();
        this.modalClose();
      }, error => {
        this.alertService.showMess(error);
      })
    } else {
      this.collaboratorSerivce.update(dataPost, this.selectedItem).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return
        }
        this.alertService.showSuccess(res.message);
        this.getData();
        this.modalClose();
      }, error => {
        this.alertService.showMess(error);
      })
    }
  }

  async onSubmitLock(id, status) {
    const confirmMessage = status ? "Bạn có đồng ý mở khóa CTV?" : "Bạn có đồng ý khóa CTV?";
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.collaboratorSerivce.updateStatus({status: status},id).subscribe(res => {
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

  async onSubmitDelete(id) {
    if ((await this.alertService.showConfirm("Bạn có đồng ý xóa CTV")).value) {
      this.collaboratorSerivce.delete(id).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return
        }
        this.alertService.showSuccess(res.message);
        this.getData();
      }, error => {
        this.alertService.showMess(error);
      })
    }
  }

}
