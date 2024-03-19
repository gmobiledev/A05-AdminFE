import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/operators';
import { ColumnMode, DatatableComponent, SelectionType } from '@swimlane/ngx-datatable';

import { CoreTranslationService } from '@core/services/translation.service';

import { locale as german } from 'app/main/tables/datatables/i18n/de';
import { locale as english } from 'app/main/tables/datatables/i18n/en';
import { locale as french } from 'app/main/tables/datatables/i18n/fr';
import { locale as portuguese } from 'app/main/tables/datatables/i18n/pt';
import { RoleService } from 'app/auth/service/role.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.scss']
})
export class ListRoleComponent implements OnInit {

  // Private
  private _unsubscribeAll: Subject<any>;
  private tempData = [];

  // public
  public contentHeader: object;
  public rows: any;
  public allRoute: any;
  public allRouteFilter: any;
  public formGroup: FormGroup;
  public submitted: boolean = false;
  public currentRouteRole: any = [];
  public selectedRoute: any = [];
  public modalRef: any;
  public isCreate: boolean = true;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  get f() {
    return this.formGroup.controls;
  }

  modalOpen(modal, item = null) {    
    if(item) {
      this.isCreate = false;
      // var modal: any = this.modalService;
      this._roleService.getPermissionRole(item.name).subscribe(res => {
        this.selectedRoute = res.data.map( x => {return x.child} );
        this.currentRouteRole = res.data.map( x => {return x.child} );
        this.formGroup.controls['role_name'].setValue(item.name);
        this.formGroup.controls['role_description'].setValue(item.description);
        const formArray: FormArray = this.formGroup.get('permission') as FormArray; 
        //sort lại ds các permission
        const tmpArr = this.allRouteFilter;

        this.allRouteFilter = tmpArr.reduce((acc, element) => {
          if (this.currentRouteRole.includes(element.child)) {
            return [element, ...acc];
          }
          return [...acc, element];
        }, []);

        if(this.selectedRoute && this.selectedRoute.length > 0) {
          this.selectedRoute.forEach(element => {
            formArray.push(new FormControl(element));
          });
        }
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.isCreate = true;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: 'lg'
      });
    }
  }

  modalClose() {
    // this.formGroup.patchValue({
    //   role_name: '',
    //   role_description: '',
    //   permission: []
    // });
    this.initForm();
    this.selectedRoute = [];
    this.modalRef.close();
  }

  onSearchRoute(event) {
    const value = event.target.value;
    
    if(value && value != '') {
      this.allRouteFilter = this.allRoute.filter(item => { return item.child.includes(value) });
    } else {
      this.allRouteFilter = this.allRoute;
    }
  }

  onChangeRoute(event, item) {
    const formArray: FormArray = this.formGroup.get('permission') as FormArray;    
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
    this.selectedRoute = this.formGroup.controls['permission'].value;
  }

  async onSubmitCreate() {
    this.submitted = true;
    if (this.formGroup.invalid) {
      return;
    }
    
    var isCreate = this.isCreate;
    let data = [];
    for(let item of this.selectedRoute) {
      if(!this.currentRouteRole.includes(item)) {
        data.push({
          parent: this.formGroup.controls['role_name'].value,
          child: item
        })
      }
    }

    const dataCreateRole = {
      name: this.formGroup.controls['role_name'].value,
      type: 1,
      description: this.formGroup.controls['role_description'].value
    }

    console.log(data);

    if((await this._alertService.showConfirm('Bạn có đồng ý lưu dữ liệu?')).value) {
      if(isCreate) {
        this._roleService.createRole(dataCreateRole).subscribe( resR => {
          if(!resR.status) {
            this._alertService.showError(resR.message);
            return;
          }

          this._roleService.addRouteToRole(dataCreateRole.name, data).subscribe( res => {
            if(res.status) {
              this._alertService.showSuccess(res.message);
              this.getData();
              this.modalClose();
              return;
            }
            this._alertService.showError(res.message)
          }, error => {
            console.log(error);
            this._alertService.showError(error)
          })
        }, error => {
          this._alertService.showError(error)
        }) 
      } else {
        const deletedRoute = this.currentRouteRole.filter( x => !this.selectedRoute.includes(x));
        const dataDelete = deletedRoute.map(item => { return {parent: dataCreateRole.name, child: item} });
        if(dataDelete.length > 0)  {          
          this._roleService.removeRouteFromRole(dataCreateRole.name, dataDelete).subscribe(resD => {

          })
        }
        this._roleService.addRouteToRole(dataCreateRole.name, data).subscribe(res => {
          if(res.status) {
            this._alertService.showSuccess(res.message);            
            this.getData();
            this.modalClose();
            return;
          }
          this._alertService.showError(res.message)
        }, error => {
          console.log(error);
          this._alertService.showError(error)
        })
      }
    }

  }

  async onSubmitDelete(item) {
    if((await this._alertService.showConfirm('Bạn có đồng ý xóa vai trò ' + item.name + '?')).value) {
      this._roleService.deleteRole(item.name).subscribe(res => {
        if(res.status) {
          this._alertService.showSuccess(res.message);          
          this.getData();
          return;
        }
        this._alertService.showError(res.message);        
      }, error => {
        console.log(error);
        this._alertService.showError(error);        
      })
    }
  }

  async loadPermission() {
    if((await this._alertService.showConfirm('Bạn có đồng ý tải dữ liệu quyền?')).value) {
      this._roleService.getAllPermission().subscribe(res => {
        if(res.status) {
          this._alertService.showSuccess(res.message);          
          this.getData();
          return;
        }
        this._alertService.showError(res.message);        
      }, error => {
        console.log(error);
        this._alertService.showError(error);        
      })
    }
  }
  
  /**
   * Constructor
   *
   */
  constructor(
    private modalService: NgbModal,
    private _coreTranslationService: CoreTranslationService,
    private _roleService: RoleService,
    private _alertService: SweetAlertService,
    private formBuiler: FormBuilder
    ) {
    this._unsubscribeAll = new Subject();
    this._coreTranslationService.translate(english, french, german, portuguese);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
        
    // content header
    this.contentHeader = {
      headerTitle: 'Vai trò',
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
            name: 'Phân quyền',
            isLink: true,
            link: '/'
          },
          {
            name: 'Vai trò',
            isLink: false
          }
        ]
      }
    };

    this.initForm();

    this.getData();
  }

  getData(): void {
    this.sectionBlockUI.start();
    this._roleService.getAll().subscribe(res => {
      this.sectionBlockUI.stop();
      this.rows = res.data;
    });
    this._roleService.getPermissionRole().subscribe(res => {
      this.allRoute = res.data;
      this.allRouteFilter = res.data;
    })
  }

  checkData(item) {
    return this.allRouteFilter.find(x => x.child == item.child) != undefined ? true : false;
  }

  initForm() {
    this.formGroup = this.formBuiler.group({
      role_name: ['', Validators.required],
      role_description: [''],
      permission: new FormArray([])
    })
  }

}
