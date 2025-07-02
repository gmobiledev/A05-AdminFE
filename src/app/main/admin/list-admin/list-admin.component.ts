import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'app/auth/service/admin.service';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-admin',
  templateUrl: './list-admin.component.html',
  styleUrls: ['./list-admin.component.scss']
})
export class ListAdminComponent implements OnInit {

  public contentHeader: object;
  public list: any;
  public totalPage: any;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: '',
    page: 1,
    pageSize: 10
  }
  public listAllService: any;
  public listServiceFilter: any;
  public selectedService: any;
  public currentService: any;
  public selectedAdminId: number;
  public formGroup: FormGroup;
  public modalRef: any;
  public isCreate: any;
  public submitted: boolean = false;
  currentUser;
  listCurrentAction;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private activeRouted: ActivatedRoute,
    private formBuiler: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private _adminService: AdminService,    
    private _alertService: SweetAlertService
  ) {
    this.activeRouted.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.page = params['page'] && params['page'] != undefined ? params['page'] : 1;
      this.searchForm.pageSize = params['pageSize'] && params['pageSize'] != undefined ? params['page'] : 10;
      this.searchForm.page = this.page;
      this.getData();
      this.getService();
    })
   }

  onSubmitSearch(): void {
    this.router.navigate(['/admin/list'], { queryParams: {keyword: this.searchForm.keyword, status: this.searchForm.status}})
  }

  loadPage(page) {
    this.page = page;
    this.router.navigate(['/admin/list'], { queryParams: {keyword: this.searchForm.keyword, status: this.searchForm.status, page: this.page} });
  }

  async onSubmitLock(id, status){
    const confirmMessage = status ? "Bạn có đồng ý mở khóa user?" : "Bạn có đồng ý khóa user?";
    if((await this._alertService.showConfirm(confirmMessage)).value) {
      this._adminService.lockUser(id, status, "").subscribe(res => {
        if(!res.status) {
          this._alertService.showError(res.message);
          return;
        }
        this._alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this._alertService.showError(err);
      })
    }
  }

  onSearchService(event) {
    const value = event.target.value;
    
    if(value && value != '') {
      this.listServiceFilter = this.listAllService.filter(item => { return item.desc.includes(value) });
    } else {
      this.listServiceFilter = this.listAllService;
    }
  }

  onChangeService(event, item) {
    const formArray: FormArray = this.formGroup.get('service_code') as FormArray;    
    if(event.target.checked){
      formArray.push(new FormControl(event.target.value));
    }
    else{
      let i: number = 0;
      formArray.controls.forEach((ctrl: FormControl) => {
        if(ctrl.value == event.target.value) {
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    this.selectedService = this.formGroup.controls['service_code'].value;

    console.log(this.selectedService);
  }

  modalOpen(modal, item = null) {    
    if(item) {
      this.selectedAdminId = item.id;
      // var modal: any = this.modalService;
      this._adminService.getServiceByAdmin(item.id).subscribe(res => {
        this.selectedService = res.data.map( x => {return x.service_code} );
        this.currentService = res.data.map( x => {return x.service_code} );
        const formArray: FormArray = this.formGroup.get('service_code') as FormArray; 
        //sort lại ds
        const tmpArr = this.listAllService.map( x => { return { id: x.id, service_code: x.code, desc: x.desc } } );

        this.listServiceFilter = tmpArr.reduce((acc, element) => {
          if (this.currentService.includes(element.service_code)) {
            return [element, ...acc];
          }
          return [...acc, element];
        }, []);

        if(this.selectedService && this.selectedService.length > 0) {
          this.selectedService.forEach(element => {
            formArray.push(new FormControl(element));
          });
        }
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    }
  }

  modalClose() {
    this.formGroup.patchValue({
      service_code: []
    });
    this.selectedService = [];
    this.modalRef.close();
  }

  async onSubmitCreate() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
   
    const dataAddService = {
      service_code: this.selectedService
    }

    if ((await this._alertService.showConfirm('Bạn có đồng ý lưu dữ liệu?')).value) {
        const deletedService = this.currentService.filter(x => !this.selectedService.includes(x));        
        if (deletedService.length > 0) {
          this._adminService.removeService(this.selectedAdminId, { service_code: deletedService }).subscribe(resD => {

          })
        }

        this._adminService.addService(this.selectedAdminId, dataAddService).subscribe(res => {
          if (res.status) {
            this._alertService.showSuccess(res.message);
            this.getData();
            this.modalRef.close();
            return;
          }
          this._alertService.showError(res.message)
        }, error => {
          console.log(error);
          this._alertService.showError(error)
        })
    }

  }

  getData(): void {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;

    this.sectionBlockUI.start();
    this._adminService.getAll(this.searchForm).subscribe(res => {
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
  
  getService() {
    this.taskService.getAllService().subscribe(res => {
      this.listAllService = res.data
    })
  }

  ngOnInit(): void {
    this.formGroup = this.formBuiler.group({      
      service_code: new FormArray([])
    })

    this.contentHeader = {
      headerTitle: 'Danh sách tài khoản',
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
            name: 'Danh sách tài khoản',
            isLink: false
          }
        ]
      }
    };
    this.getData();
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX == item) : false;
  }

}
