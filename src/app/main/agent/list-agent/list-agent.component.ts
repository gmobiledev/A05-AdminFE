import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { CreateAgentDto, CreateAgentServiceDto, CreateUserDto, UpdateStatusAgentDto } from 'app/auth/service/dto/user.dto';
import { TaskService } from 'app/auth/service/task.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-agent',
  templateUrl: './list-agent.component.html',
  styleUrls: ['./list-agent.component.scss']
})
export class ListAgentComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public totalPage: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    status: '',
    page: 1
  }

  public selectedUserId: number;
  public listAllService: any;
  public listServiceFilter: any;
  public listServiceTmp: any;
  public selectedService: any = [];
  public currentService: any;

  public isCreate: boolean = false;
  public submitted: boolean = false;  
  public exitsUser: boolean = false;

  public submittedUpload: boolean = false;
  public filesData: any;
  public filesImages: any;
  public adminId: any;
  public refCode: any;

  public currentUser: any;
  public isAdmin: boolean = false;

  public modalRef: any;
  public titleModal: string;
  public formGroup: FormGroup;
  public subFormGroup: FormGroup;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
    private userService: UserService,
    private alertService: SweetAlertService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.status = params['status'] && params['status'] != undefined ? params['status'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : '';

      this.getData();
      this.getService();
    })
    
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/agent'], { queryParams: this.searchForm})
  }

  modalOpen(modal, item = null) { 
    if(item) {
      this.titleModal = "Cập nhật đại lý";
      this.isCreate = false;
      this.selectedUserId = item.id;
      this.userService.getAgentServices(item.id).subscribe(res => {

        // this.selectedService = res.data.map( x => {return x.type} );
        // this.currentService = res.data.map( x => {return x.type} );

        // const formArray: FormArray = this.formGroup.get('service_code') as FormArray; 
        // //sort lại ds các permission
        // const tmpArr = this.listServiceFilter;

        // this.listServiceFilter = tmpArr.reduce((acc, element) => {
        //   if (this.currentService.includes(element.child)) {
        //     return [element, ...acc];
        //   }
        //   return [...acc, element];
        // }, []);

        // if(this.selectedService && this.selectedService.length > 0) {
        //   this.selectedService.forEach(element => {
        //     formArray.push(new FormControl(element));
        //   });
        // }

        this.currentService = res.data.map( x => { return { id: x.id, status: x.status, ref_code: x.referal_code, service_code: x.type } });
        let arrayControl = <FormArray>this.formGroup.controls['agents_service'];
        for (let i = 0; i < this.currentService.length; i++ ) {
          const newGroup = this.formBuilder.group({
            id: [{value:this.currentService[i]['id'], disabled: true}],
            status: [{value:this.currentService[i]['status'], disabled: true}],
            ref_code: [{value: this.currentService[i]['ref_code'], disabled: true}],
            service_code: [{value: this.currentService[i]['service_code'], disabled: true}]
          });
          const index = this.listServiceFilter.findIndex(item => item.code == this.currentService[i]['service_code']);
          this.listServiceFilter[index]['disabled'] = 'disabled';
          arrayControl.push(newGroup);
        }
        
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'lg'
        });
      })
    } else {
      this.titleModal = "Thêm đại lý";
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

  /*
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
  */

  onSubmitSearch(): void {
    this.searchForm.page = 1;
    this.router.navigate(['/agent'], { queryParams: this.searchForm})
  }

  addInput() {
    let arrayControl = <FormArray>this.formGroup.controls['new_agents_service'];
    let newGroup = this.formBuilder.group({
      ref_code: [],
      service_code: []
    });
    arrayControl.push(newGroup);
  }

  removeInput(index) {
    let arrayControl = <FormArray>this.formGroup.controls['new_agents_service'];
    const i = this.listServiceFilter.findIndex(item => item.code == this.formGroup.controls['new_agents_service'].value[index]['service_code']);
    if(i != -1) {
      this.listServiceFilter[i]['disabled'] = '';
    }    
    arrayControl.removeAt(index);
  }

  onSelectService(service_code) {
    const index = this.listServiceFilter.findIndex(item => item.code == service_code);
    this.listServiceFilter[index]['disabled'] = 'disabled';
  }
  
  onFocusMobile() {
    this.exitsUser = false;
    this.titleModal = "Thêm đại lý";
  }

  async updateStatusAgentService(i, status = null) {
    console.log(i);
    console.log(this.formGroup.controls['agents_service'].value[i]);
    const confirmMessage = status ? "Bạn có đồng ý mở khóa dịch vụ của đại lý?" : "Bạn có đồng ý khóa dịch vụ của đại lý?";
    const data = {
      id: this.formGroup.controls['agents_service'].value[i]['id'],
      status: status
    }

    if((await this.alertService.showConfirm(confirmMessage)).value) {
      this.userService.updateStatusAgent(this.selectedUserId, data).subscribe(res => {
        if(!res.status) {
          this.alertService.showError(res.message);
          return;
        }        
        this.modalRef.close();
        this.initForm();
        this.alertService.showSuccess(res.message);
        this.getData();
      }, err => {
        this.alertService.showError(err);
      })
    }
  }

  /**
   * Check ton tai so mobile
   * 
   */
  onCheckExits() {
    if (this.formGroup.controls['mobile'].value && this.formGroup.controls['mobile'].value != '') {
      this.userService.getByMobile(this.formGroup.controls['mobile'].value).subscribe(async res => {
        this.selectedUserId = res.data.id;
        if (res.status && res.data && !res.data.is_agent) {
          this.titleModal = "Đặt làm đại lý";
          this.exitsUser = true;
          return;
        } else if (res.status && res.data && res.data.is_agent) {
          
          this.userService.getAgentServices(res.data.id).subscribe(res => {
            this.currentService = res.data.map(x => { return { id: x.id, status: x.status, ref_code: x.referal_code, service_code: x.type } });
            let arrayControl = <FormArray>this.formGroup.controls['agents_service'];
            for (let i = 0; i < this.currentService.length; i++) {
              const newGroup = this.formBuilder.group({
                id: [{ value: this.currentService[i]['id'], disabled: true }],
                status: [{ value: this.currentService[i]['status'], disabled: true }],
                ref_code: [{ value: this.currentService[i]['ref_code'], disabled: true }],
                service_code: [{ value: this.currentService[i]['service_code'], disabled: true }]
              });
              const index = this.listServiceFilter.findIndex(item => item.code == this.currentService[i]['service_code']);
              this.listServiceFilter[index]['disabled'] = 'disabled';
              arrayControl.push(newGroup);
            }
            this.titleModal = "Cập nhật đại lý";
            this.isCreate = false;
            this.exitsUser = false;
          })
        }
        this.titleModal = this.isCreate ? "Thêm đại lý" : "Cập nhật đại lý";
        this.exitsUser = false;
      })
    }
  }

  /**
   * Tao tai khoan dai ly
   */
  async onSubmitCreate() {
    console.log(this.formGroup.controls['new_agents_service'].value);
    if (!this.exitsUser && this.isCreate) {
      this.submitted = true;
      if (this.formGroup.invalid) {
        return;
      }
      const data: CreateAgentDto = {
        username: this.formGroup.controls['mobile'].value,
        mobile: this.formGroup.controls['mobile'].value,
        agent_service: this.formGroup.controls['new_agents_service'].value,
        password: this.formGroup.controls['password'].value,
      }
      if ((await this.alertService.showConfirm('Bạn có đồng ý lưu dữ liệu?')).value) {
        this.userService.createAgent(data).subscribe(res => {
          if (!res.status) {
            this.alertService.showError(res.message);
            this.submitted = false;
            return;
          }
          this.modalRef.close();
          this.initForm();
          this.alertService.showSuccess(res.message);
        })
      }
    } else {
      this.userService.addServicesToAgent(this.selectedUserId,  this.formGroup.controls['new_agents_service'].value).subscribe(res => {
        if (!res.status) {
          this.alertService.showError(res.message);
          this.submitted = false;
          return;
        }
        this.modalRef.close();
        this.initForm();
        this.alertService.showSuccess(res.message);
      })
    }
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
      formData.append("images", this.filesImages);
      formData.append("admin_id", this.adminId ? this.adminId : null);
      formData.append("ref_code", this.refCode ? this.refCode : null);
      this.userService.createAgentBatch(formData).subscribe(res => {
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

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách đại lý',
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
            name: 'Danh sách đại lý',
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

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if(this.currentUser && this.currentUser.roles) {
      const arrayRoles = this.currentUser.roles.map( item => {return item.item_name.toLowerCase()});
      if(arrayRoles.includes("admin") || arrayRoles.includes("root")) {
        this.isAdmin = true;
      }
    }
    this.sectionBlockUI.start();
    this.userService.getAllAgents(this.searchForm).subscribe(res => {
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
    this.userService.getAgentTypes().subscribe(res => {
      this.listAllService = res.data;
      this.listServiceFilter = res.data.map( x => {return { disabled: '', code: x.code, desc: x.desc }} );
      this.listServiceTmp = res.data;
    })
  }

}
