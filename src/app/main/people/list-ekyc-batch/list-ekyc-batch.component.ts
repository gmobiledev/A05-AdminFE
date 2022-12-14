import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'app/auth/service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-list-ekyc-batch',
  templateUrl: './list-ekyc-batch.component.html',
  styleUrls: ['./list-ekyc-batch.component.scss']
})
export class ListEkycBatchComponent implements OnInit {
  public contentHeader: any;
  public list: any;
  public total: number;
  public page: number = 1;
  public pageSize: number;
  public searchForm = {
    keyword: '',
    address: '',
    page: 1,
  }
  public modalRef: any;
  public filesData: any;
  public filesImages: any;
  public submittedUpload: boolean = false;
  public submittedCheck: boolean = false;
  public submittedExport: boolean = false;
  public idCheck: any;

  @BlockUI('section-block') sectionBlockUI: NgBlockUI;

  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.route.queryParams.subscribe(params => {
      // this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';      
      // this.searchForm.address = params['address'] && params['address'] != undefined ? params['address'] : '';      
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;  
      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.router.navigate(['/people/list-ekyc-batch'], { queryParams: this.searchForm})
  }

  modalOpen(modal,) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  modalClose() {
    this.modalRef.close();
  }

  async onFileChangeExcel(event) {
    this.filesData = event.target.files[0];
    
  }

  async onFileChangeImages(event) {
    this.filesImages = event.target.files[0];
  }

  async onSubmitUpload() {
    if (!this.filesData || !this.filesImages) {
      this.alertService.showError("Vui lòng nhập dữ liệu");
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true;
      const formData = new FormData();
      formData.append("files", this.filesData);
      formData.append("images", this.filesImages);
      this.userService.postFileExcelPeople(formData).subscribe(res => {
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
      })
    }
  }

  onCheckEkycData(item) {
    this.idCheck = item.id;
    this.submittedCheck = true;
    const data = {
      partner: 'GPAY',
      file_name: item.file_name
    }
    this.userService.checkEkyc(data).subscribe(res => {
      this.idCheck = null;
      if (!res.status) {
        this.alertService.showError(res.message);
        this.submittedCheck = false;
        return;
      }
      this.submittedCheck = false;
      this.alertService.showSuccess(res.message);
      
      this.getData();
    })
  }
  
  onExportExcel(item) {
    this.submittedExport = true;
    let body = {
      file: item 
    }
    this.userService.exportExcelEkyc(body).subscribe(res => {
      this.submittedExport = false;
      console.log("RESSSSSS");
      console.log(res);
      var newBlob = new Blob([res.body], { type: res.body.type });
      let url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = item;
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách lô ekyc',
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
            name: 'Danh sách lô ekyc',
            isLink: false
          }
        ]
      }
    };  
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/people/list-ekyc-batch'], { queryParams: this.searchForm});
  }

  getData(): void {
    this.sectionBlockUI.start();
    this.userService.listEkycBatch(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      this.sectionBlockUI.stop();
      console.log("ERRRR");
      console.log(error);
    })
  }

}