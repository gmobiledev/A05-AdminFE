import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { TelecomService } from 'app/auth/service/telecom.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { error } from 'console';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-client2g',
  templateUrl: './client2g.component.html',
  styleUrls: ['./client2g.component.scss']
})
export class Client2gComponent implements OnInit {
  @Input() service: string;
  private myUrl = "sim-so/client2g"

  searchSim: any;
  selectedItem: any;
  itemBlockUI: any;
  modalRef: any;
  selectedAgent: any;
  public searchForm: any = {
    mobile: '',    
    id_no: ''
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
      this.activeRouted.queryParams.subscribe(params => {
        // Trim mobile parameter
        this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined 
          ? params['mobile'].trim() 
          : '';
        this.getData();
      })
  }

  ngOnInit() {
  }

  onSubmitSearch() {
    // Trim mobile and id_no before navigation
    this.searchForm.mobile = this.searchForm.mobile.trim();
    this.searchForm.id_no = this.searchForm.id_no.trim();
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    
    // Ensure trimmed values are used when fetching data
    const trimmedSearchForm = {
      mobile: this.searchForm.mobile.trim(),
      id_no: this.searchForm.id_no.trim()
    };

    this.telecomService.get2GCustomerInfo(trimmedSearchForm).subscribe(res => {
      this.list = res.data;      
    }, error => {
      this.list = []
    });
  }

  async onConfirmThanhToanNoCuoc(item, modal) {
    if ((await this.alertService.showConfirm("Bạn có xác nhận đã thanh toán toán nợ cước cho số " + item.msisdn.msisdn)).value) {
      //goi api xác nhận thu nợ cước tại quầy
      this.sectionBlock.start();
      const data = {
        msisdn: item.msisdn.msisdn,
        amount: Math.abs(item.msisdn.amount)
      }
      try {
        const rpayment = await this.telecomService.confirmPayDebit(data).toPromise();
        this.sectionBlock.stop();
        if(!rpayment || !rpayment.status) {
          this.alertService.showMess(rpayment.message);
          return;
        }       
        this.alertService.showMess(rpayment.message);
        this.getData();
      } catch (error) {
        this.sectionBlock.stop();
        this.alertService.showMess(error);
      }
      
    }
  }

  // Rest of the methods remain the same...
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

  showLoaiThuebao(item) {
    let text = 'Trả trước';
    if(item.prepaid === 0) {
      text = 'Trả sau';
    }
    return text;
  }

  async onSubmitThanhToanNoCuoc(item, modal) {
    if ((await this.alertService.showConfirm("Bạn có đồng ý tạo QR toán nợ cước cho số " + item.msisdn.msisdn)).value) {
      //goi api request qr thanh toán nợ
      this.sectionBlock.start();
      const data = {
        msisdn: item.msisdn.msisdn,
        amount: Math.abs(item.msisdn.amount)
      }
      try {
        const rpayment = await this.telecomService.requestPayDebit(data).toPromise();
        this.sectionBlock.stop();
        if(!rpayment || !rpayment.status) {
          this.alertService.showMess(rpayment.message);
          return;
        }
        this.qrInfoPayment = rpayment.data;
        //show modal
        this.modalOpen(modal);
      } catch (error) {
        this.sectionBlock.stop();
        this.alertService.showMess(error);
      }
      
    }
  }

  // Other methods remain the same...
  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
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