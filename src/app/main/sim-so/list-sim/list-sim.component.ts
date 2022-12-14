import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-list-sim',
  templateUrl: './list-sim.component.html',
  styleUrls: ['./list-sim.component.scss']
})
export class ListSimComponent implements OnInit {

  public contentHeader: any;
  public list: any;

  public filesData: any;
  public submittedUpload: boolean;

  public titleModal: string;
  public modalRef: any;

  public totalItems;
  public searchForm = {
    name: '',
    category_id: '',
    page: 1,
    page_size: 20,
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private alertService: SweetAlertService,
    private telecomService: TelecomService
  ) { 
    this.route.queryParams.subscribe(params => {
      this.searchForm.name = params['name'] && params['name'] != undefined ? params['name'] : '';
      this.searchForm.category_id = params['category_id'] && params['category_id'] != undefined ? params['category_id'] : '';
      this.searchForm.page = params['page'] && params['page'] != undefined ? params['page'] : 1;

      this.getData();
    })  
  }

  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate(['/sim-so'], { queryParams: this.searchForm})
  }

  modalOpen(modal, item = null) { 
      this.titleModal = "Thêm đại lý";
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

  async onSubmitUpload() {
    if (!this.filesData) {
      this.alertService.showError("Vui lòng nhập đủ dữ liệu");
    }
    if ((await this.alertService.showConfirm("Bạn có đồng ý tải lên dữ liệu của file excel")).value) {
      this.submittedUpload = true;
      const formData = new FormData();
      formData.append("files", this.filesData);
      
      this.telecomService.productImportBatch(formData).subscribe(res => {
        this.submittedUpload = false;
        if (!res.status) {
          this.alertService.showError(res.message);
          return;
        }
        this.filesData = null;      
        this.modalClose();
        this.alertService.showSuccess(`Upload thành công ${res.data.count} số`);
        this.getData();
      }, error => {
        this.submittedUpload = false;
        this.alertService.showError(error);
      })
    }
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Upload số, sim',
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
            name: 'Upload số, sim',
            isLink: false
          }
        ]
      }
    };
  }

  getData() {
    const params = {
      name: this.searchForm.name,
      category_id: this.searchForm.category_id,
      take: this.searchForm.page_size,
      skip: (this.searchForm.page - 1)*this.searchForm.page_size
    }
    // this.telecomService.productListAll(params).subscribe(res => {
    //   this.list = res.data.products;
    //   this.totalItems = res.data.count;
    // });
  }

}
