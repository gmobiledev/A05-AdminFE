import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BatchType, PriceAction } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-edit-products',
  templateUrl: './edit-products.component.html',
  styleUrls: ['./edit-products.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditProductsComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  public contentHeader = {
    headerTitle: 'Cập nhật sản phẩm',
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
          name: 'Danh sách kho',
          isLink: true,
          link: '/inventory/sell-chanel'
        },
        {
          name: 'Cập nhật sản phẩm',
          isLink: false
        }
      ]
    }
  };
  currentUser;
  public searchForm = {
    channel_id: '',
    admin_id: '',
    key_from: '',
    key_to: '',
    brand: '',
    category_id: '',
    take: '',
    level: ''
  }
  seachMyChannel = {
    user_id: '',
    channel_id: '',
    page_size: 1000
  }

  public searchFormProduct = {
    keyword: '',
    page: 1,
    skip: 0,
    take: 1000,
    channel_id: '',
    status_array: []
  }

  public createBatchExportForm = {
    to_channel_id: '',
    channel_id: '',
    quantity: '',
    title: '',
    user_id: ''
  };

  public retrieveForm = {
    retrieve_all: false
  }

  public basicSelectedOption: number = 10;
  public tmpSelected = [];
  public selectedItems = [];
  public list;
  tempList;
  tempSelectedItems;
  isResetTempList: boolean = true;
  isResetTempSelected: boolean = true;
  public listChannel;
  public listInputChannel;
  public submitted: boolean = false;
  public listAttribute = [
    
  ]
  selectedAttributes: any;
  disableSelectParent: boolean = false;  
  typeCurrentBatch;
  titleFromChannel = 'Kho xuất đi';  
  serverPaging = {
    total_items: '',    
  }
  dataRetrieveFile = {
    attached_file_name: '',
    attached_file_content: ''
  };
  modalRef: any;
  listPriceAction = PriceAction;
  price_action = '';

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly alertService: SweetAlertService,
    private readonly route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  onSelect(event) {
    const selected = event.selected
    this.tmpSelected = [];    
    this.tmpSelected.splice(0, this.tmpSelected.length);
    Array.prototype.push.apply(this.tmpSelected, selected);   
    event.selected = [];      
  }

  onChangeCategory(event) {
    if(event.target.value == 2) {
      this.listAttribute = [];
    } else if (event.target.value == 3) {
      this.listAttribute = [
        { id: 'NORMAL', name: 'NORMAL' },
        { id: 'QUASI', name: 'QUASI' },
        { id: 'BRONE', name: 'BRONE' },
        { id: 'SILVER', name: 'SILVER' },
        { id: 'GOLD', name: 'GOLD' },
        { id: 'PLATINUM', name: 'PLATINUM' },
      ]
    }
  }

  modalOpen(modal, item = null) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  modalClose() {
    this.modalRef.close();
    this.getData();
  }


  onAddItems() {
    if(this.tmpSelected.length > 0) {
      Array.prototype.push.apply(this.selectedItems,this.tmpSelected);  
      this.selectedItems = [...this.selectedItems]  
      const arrayNameProduct = this.tmpSelected.map(x => {return x.id});
      this.list = this.list.filter(x => !arrayNameProduct.includes(x.id));
      this.tempList = this.tempList.filter(x => !arrayNameProduct.includes(x.id));
      this.tempList = [...this.tempList];
      // this.tempList = this.isResetTempList  ? [...this.list] : [...this.tempList];
      this.list = [...this.list];
      this.tempSelectedItems =[...this.selectedItems];
      this.disableSelectParent = true;
      this.tmpSelected = [];      
    }    
    this.table.selected = [];
  }

  onSelectToRemove({ selected }) {

  }

  onRemove(item) {
    this.tmpSelected = [];
    
    const index = this.selectedItems.findIndex(x => x.name == item.toString());
    this.list.push(this.selectedItems[index]);
    this.list = [...this.list];
    this.tempList = [...this.list];
    this.selectedItems.splice(index, 1);
    this.tempSelectedItems = [...this.selectedItems];
    if(this.selectedItems.length < 1) {
      this.selectedItems = [];
      this.tempSelectedItems = [];      
      this.disableSelectParent = false;
    }
  }

  filterList(event) {
    const val = event.target.value.toLowerCase();
    if(val) {
      this.isResetTempList = false;
    }
    // filter our data
    const temp = this.list.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.tempList = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filterListSeleted(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.selectedItems.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.tempSelectedItems = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onChangeParentChannel() {
    this.seachMyChannel.channel_id = this.searchForm.channel_id;
    this.inventoryService.getMyChannel(this.seachMyChannel).subscribe(res => {
      this.listInputChannel = res.data.items;
    }, error => {
      this.alertService.showMess(error);
    });
    this.searchProductStore();
  }

  onSearchParentChannel(event) {
    console.log(event);
  }

  // TÌm số trong kho
  searchProductStore(page = null) {
    if (!this.searchForm.channel_id) {
      this.alertService.showMess("Vui lòng chọn kho xuất đi");
      return;
    }
    this.sectionBlockUI.start();

    if (this.searchFormProduct.take > 3000) {
      this.searchFormProduct.take = 3000;
    }
    this.searchFormProduct.page = page && page.offset ? page.offset + 1 : 1;
    this.searchFormProduct.skip = (this.searchFormProduct.page - 1) * this.searchFormProduct.take;
    this.searchFormProduct.channel_id = this.searchForm.channel_id;
    this.searchFormProduct.status_array = [0, 2];
    this.inventoryService.getAllSim(this.searchFormProduct).subscribe(res => {
      this.sectionBlockUI.stop();
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      const data = res.data.data;
      this.serverPaging.total_items = data.count;
      this.tempList = data.items.filter(x => x.status != 1);
      this.list = data.items.filter(x => x.status != 1);
    }, error => {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    })

  }

  onChangeInputKeywordSearch(event) {
    this.searchFormProduct.keyword = event.target.value;
    this.searchProductStore();
  }

  async onSubmitData() {
    this.submitted = true;
    // if(!this.searchForm.channel_id && this.typeCurrentBatch == BatchType.OUTPUT) {
    //   this.alertService.showMess("Vui lòng chọn kho xuất đi");
    //   return;
    // }
    // if(!this.searchForm.channel_id && this.typeCurrentBatch == BatchType.RETRIEVE) {
    //   this.alertService.showMess("Vui lòng chọn kho cần thu hồi");
    //   return;
    // }
    // if(this.typeCurrentBatch == BatchType.OUTPUT) {
    //   this.createBatchOutput();
    // } else if (this.typeCurrentBatch == BatchType.RETRIEVE) {
    //   if ((await this.alertService.showConfirm('Bạn có chắc chắn thu hồi các số của kho?')).value) {
    //     this.createBatchRetrieve();
    //   }      
    // }
  }

  /**
   * Cập nhật giá
   * 
   * @returns 
   */
  async updatePrice() {
    if(!this.createBatchExportForm.to_channel_id ) {
      this.alertService.showMess("Vui lòng chọn kho xuất đến");
      return;
    }
    
  }
  

  //init data
  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser) {
      this.seachMyChannel.user_id = this.currentUser.id;
      this.searchForm.admin_id = this.currentUser.id;
    }
    this.sectionBlockUI.start();
    this.inventoryService.getMyChannel(this.seachMyChannel).subscribe(async res => {
      this.listChannel = res.data.items;
      if(this.typeCurrentBatch == BatchType.RETRIEVE) {
        let childChannels = [];
        let params = {
          page_size: 1000,
          channel_ids: this.listChannel.map(x => x.id)
        }
        let res = await this.inventoryService.getMyChannel(params).toPromise();
        Array.prototype.push.apply(childChannels,res.data.items);       
        this.listChannel = [...childChannels];
        this.listChannel = this.listChannel.filter(x => x.parent_id != null)
      }
      this.sectionBlockUI.stop();
    }, error => {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    })
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;    
    this.getData();
  }  

}
