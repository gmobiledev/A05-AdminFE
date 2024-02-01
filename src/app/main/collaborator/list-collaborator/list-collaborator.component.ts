import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'app/auth/service/admin.service';

@Component({
  selector: 'app-list-collaborator',
  templateUrl: './list-collaborator.component.html',
  styleUrls: ['./list-collaborator.component.scss']
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
  public list: any;
  public page: any;
  public total: any;
  public pageSize: any = 20;
  public formGroup;
  public provinces = []
  public residence_districts = []
  public residence_commues = []

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private adminSerivce: AdminService,
  ) { }

  ngOnInit(): void {   
    this.initForm() ;
  }

  onSubmitSearch(): void {
    this.router.navigate(['/collaborator'], { queryParams: this.searchForm })
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/collaborator'], { queryParams: this.searchForm })
  }

  async onChangeResidenceProvince(id, init = null) {  
    if(this.provinces.length > 0) {
      this.residence['province'] = (this.provinces.find(item => item.id == id)).title;
    }    
    try {
      const res = await this.adminSerivce.getDistricts(id).toPromise();
      if (res.status == 1) {
        if(!init) {
          this.formGroup.controls['residence_district'].setValue('');
        }
        this.residence_districts = res.data;
        this.residence_commues = []
      }
    } catch (error) {
      
    }
  }

  async onChangeResidenceDistrict(id, init = null) {
    if(this.residence_districts.length > 0) {
      this.residence['district'] = (this.residence_districts.find(item => item.id == id)).title;
    }
    try {
      const res = await this.adminSerivce.getCommunes(id).toPromise();
      if (res.status == 1) {
        if(!init) {
          this.formGroup.controls['residence_commune'].setValue('');
        }
        this.residence_commues = res.data
      }
    } catch (error) {
      
    }
  }
  
  onChangeResidenceCommune(event) {
    if(this.residence_commues.length > 0) {
      this.residence['commune'] = (this.residence_commues.find(item => item.id == event)).title;
    }
  }

  initForm() {
    this.formGroup = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      phone_number: ['', Validators.required],
      province: ['', Validators.required],
      district: ['', Validators.required],
      commune: ['', Validators.required],
      address_street: [''],
    })
  }

}
