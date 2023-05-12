import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GtalkService } from 'app/auth/service/gtalk.service';
import { TelecomService } from 'app/auth/service/telecom.service';

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
  alertService: any;
  selectedAgent: any;
  public searchForm: any = {
    mobile: '',    
  }
  
  currentUser: any;
  totalItems: any;
  list: any;
 

  constructor(  
    private modalService: NgbModal,
    private gtalkService: GtalkService,
    private telecomService: TelecomService,
    private activeRouted: ActivatedRoute,
    private router: Router,
    ) { 
      this.activeRouted.queryParams.subscribe(params => {
        this.searchForm.mobile = params['mobile'] && params['mobile'] != undefined ? params['mobile'] : '';
        this.getData();
      })
    }

  ngOnInit() {
  }
  async modalOpen(modal, item = null) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'xl',
      backdrop: 'static',
      keyboard: false
    });
  }

  modalClose() {
    this.selectedItem = null;
    
    this.modalRef.close();
  }
  async modalViewAgentOpen(modal, item = null) {
    if (item) {
      this.itemBlockUI.start();

      try {
        let res = await this.gtalkService.taskViewAgent(item);
        if (!res.status) {
          this.getData();
          this.alertService.showMess(res.message);
        }
        this.selectedAgent = res.data;
        this.itemBlockUI.stop();
        this.modalRef = this.modalService.open(modal, {
          centered: true,
          windowClass: 'modal modal-primary',
          size: 'sm',
          backdrop: 'static',
          keyboard: false
        });
      } catch (error) {
        this.itemBlockUI.stop();
        return;
      }

    }
  }
  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.telecomService.get2GCustomerInfo(this.searchForm).subscribe(res => {
      this.list = res.data;      
    });
  }                                             
  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
  }
  onSubmitSearch(){
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
  }

}
