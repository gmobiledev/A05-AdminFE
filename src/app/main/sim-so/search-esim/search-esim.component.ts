import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { error } from 'console';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-search-esim',
  templateUrl: './search-esim.component.html',
  styleUrls: ['./search-esim.component.scss']
})
export class SearchEsimComponent implements OnInit {
  @Input() service: string;
  private myUrl = "esim-search"

  public total: any;
  public item: any;
  public showMessage: boolean
  public selectedItem: any;
  public taskTelecomStatus;
  public modalRef: any;

  searchSim: any;
  itemBlockUI: any;
  selectedAgent: any;
  public searchForm: any = {
    number: '',    
    serial: ''
  }
  
  currentUser: any;
  totalItems: any;
  list: any = [];

  qrInfoPayment = {
    amount: 0,
    amount_holder: '',
    account_number: '',
    qrcode: ''
  }

  @BlockUI('section-block') sectionBlock: NgBlockUI;
 
  constructor(  
    private modalService: NgbModal,
    private gtalkService: GtalkService,
    private telecomService: TelecomService,
    private activeRouted: ActivatedRoute,
    private alertService: SweetAlertService,
    private router: Router,
    ) { 
      // Commented out originally, but kept for potential future use
      this.activeRouted.queryParams.subscribe(params => {
        // Trim parameters if needed
        this.searchForm.number = params['number'] && params['number'] != undefined 
          ? params['number'].trim() 
          : '';
        this.searchForm.serial = params['serial'] && params['serial'] != undefined 
          ? params['serial'].trim() 
          : '';
      })
  }

  ngOnInit() {
  }

  loadPage(page) {
    // Trim search form values before navigation
    this.searchForm.number = this.searchForm.number.trim();
    this.searchForm.serial = this.searchForm.serial.trim();
    this.searchForm.page = page;
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
  }

  onSubmitSearch() {
    // Trim search form values before making the service call
    this.searchForm.number = this.searchForm.number.trim();
    this.searchForm.serial = this.searchForm.serial.trim();

    // Log trimmed search values
    console.log(this.searchForm);

    this.telecomService.getDetaileSim(this.searchForm).subscribe(res => {
      if (res.data && Object.keys(res.data).length > 0) {
        this.showMessage = false;
        this.item = res.data
        this.total = res.data.count;
      }
    }, err => {
      this.alertService.showMess(err);
    })
  }

  // Existing methods remain the same (modalOpen, modalClose, etc.)
  async modalOpen(modal, item = null) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      backdrop: 'static',
      keyboard: false
    });
  }

  modalClose() {
    this.selectedItem = null;
    
    this.modalRef.close();
    this.getData();
  }

  getData() {
    // Kept as original, currently commented out
    // this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    // this.telecomService.getDetaileSim(this.searchForm).subscribe(res => {
    //   this.list = res.data;      
    // }, error =>{
    //   this.list = []
    // });
  }

  // Other methods remain unchanged
  showLoaiThuebao(item) {
    let text = 'Trả trước';
    if(item.prepaid === 0) {
      text = 'Trả sau';
    }
    return text;
  }

  async modalApprovalOpen(modal, item = null, size = 'xm') { 
    if(item) {     
      this.selectedItem = item;
      this.modalRef = this.modalService.open(modal, {
        centered: true,
        windowClass: 'modal modal-primary',
        size: size,
        backdrop : 'static',
        keyboard : false
      });            
    }
  }
}