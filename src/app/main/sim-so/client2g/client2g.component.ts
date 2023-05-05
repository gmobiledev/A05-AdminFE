import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  gtalkService: any;
  alertService: any;
  selectedAgent: any;
  searchForm: any;
  router: any;
  telecomService: any;
  currentUser: any;
  totalItems: any;
  list: any;
 

  constructor(  private modalService: NgbModal) { }

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
     if (this.service == "gtalk") {
       this.gtalkService.getClient2g(this.searchForm).subscribe(res => {
         this.list = res.data.items;
         this.totalItems = res.data.count;
       });
     } else {
       this.telecomService.getClient2g(this.searchForm).subscribe(res => {
         this.list = res.data.items;
         this.totalItems = res.data.count;  
       });
     }
  }                                             
  loadPage(page) {
    this.searchForm.page = page;
    this.router.navigate([this.myUrl], { queryParams: this.searchForm });
  }
  onSubmitSearch(){

  }

}
