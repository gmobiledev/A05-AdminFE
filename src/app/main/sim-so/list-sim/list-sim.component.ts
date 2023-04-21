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

  async onFileChangeExcel(event) {
    this.filesData = event.target.files[0];    
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Msisdn',
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
            name: 'Msisdn',
            isLink: false
          }
        ]
      }
    };
  }

  getData() {
   
  }

}
