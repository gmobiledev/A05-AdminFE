import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { UpdatePriceDto, UpdateStatusProductDto } from 'app/auth/service/dto/inventory.dto';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BatchType, MAXIMUM_VALUE, PriceAction, ProductStatus } from 'app/utils/constants';
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
  @BlockUI('item-block') itemBlockUI: NgBlockUI;
  @ViewChild('fileExcel') fileExcel: ElementRef;
  
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
    take: MAXIMUM_VALUE.ROW_QUERY_PRODUCT_BATCH,
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
    take: MAXIMUM_VALUE.ROW_QUERY_PRODUCT_BATCH,
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
  dataUpdatePrice: UpdatePriceDto = {
    products : [],
    channel_id: 0,
    change_type: '',
    change_value: 0,
    confirm: false
  }
  productStatus = ProductStatus;
  fileExcelPrice;
  currentChannel;
  currentExcelFileSearch;
  listStatus;
  listProductFail = [];
  reasonFail;

  constructor(    
    private readonly inventoryService: InventoryService,
    private readonly alertService: SweetAlertService,
    private readonly route: ActivatedRoute,
    private modalService: NgbModal
  ) { 
    this.route.queryParams.subscribe(params => {   
      this.listStatus = Object.keys({
        'STATUS_AVAILABLE': 2,    
    'LOCKED_BY_ADMIN': 4,
    'STATUS_INIT' :0
      }).filter(p => !Number.isInteger(parseInt(p))).reduce((obj, key) => {
        obj[key] = ProductStatus[key];
        return obj;
      }, {});

      this.searchForm.channel_id = params['channel_id'] && params['channel_id'] != undefined ?  params['channel_id'] : '';
      this.getData();
      this.searchProductStore();
    })

  }

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
    this.listProductFail = [];
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
      this.alertService.showMess("Vui lòng chọn kho");
      return;
    }
    this.sectionBlockUI.start();

    this.searchForm.level = this.selectedAttributes !== null && this.selectedAttributes != undefined ? this.selectedAttributes : '';
    console.log(this.selectedAttributes);
    let paramSearch = { ...this.searchForm }
    for (let key in paramSearch) {
      if (paramSearch[key] === '') {
        delete paramSearch[key];
      }
    }
    paramSearch['to_update_status'] = true;
    if(this.currentExcelFileSearch) {
      this.onSelectFileExcel({
        target: {
          files: [
            this.currentExcelFileSearch
          ]
        }
      })
      this.sectionBlockUI.stop();
      return;
    }
    this.inventoryService.searchProductStore(paramSearch).subscribe(res => {
      this.sectionBlockUI.stop();
      if (!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      const data = res.data;
      this.tempList = data.items;
      this.list = data.items;
    }, error => {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    })

  }

  onChangeInputKeywordSearch(event) {
    this.searchFormProduct.keyword = event.target.value;
    this.searchProductStore();
  }

  onChangeType() {
    this.dataUpdatePrice.change_value = 0;
  }

  onSelectFileExcel(event) {
    if(!this.searchForm.channel_id) {
      this.alertService.showMess("Vui lòng chọn kho cần xuất đi");
      return;
    }
    
    if (event.target.files && event.target.files[0]) {
      this.sectionBlockUI.start();
      this.currentExcelFileSearch = event.target.files[0];
      let formData = new FormData();
      
      for(let key in this.searchForm) {
        if(this.searchForm[key] !== '') {          
          formData.append(key, this.searchForm[key]);
        }
      } 
      formData.append("files", this.currentExcelFileSearch);
      this.inventoryService.searchExcelProductExport(formData).subscribe(res => {
        this.sectionBlockUI.stop();
        const data = res.data;
        this.tempList = data.items;
        this.list = data.items;
        this.fileExcel.nativeElement.value = "";
      },error => {
        this.sectionBlockUI.stop();
        this.fileExcel.nativeElement.value = "";
        this.alertService.showMess(error);

      })
    }
  }

  onRemoveFileExcel() {
    this.currentExcelFileSearch = null;
  }

  async onSubmitData() {
    this.submitted = true;
    this.dataUpdatePrice.channel_id = parseInt(this.searchForm.channel_id);
    this.dataUpdatePrice.products = this.selectedItems.map(x => {return x.id});
    let res;
    if ((await this.alertService.showConfirm('Bạn có chắc chắn cập nhật giá của các số?')).value) {
      try {
        res = await this.inventoryService.updatePriceProduct(this.dataUpdatePrice).toPromise();  
        if(res.data.need_confirm) {
          if ((await this.alertService.showConfirm(res.message)).value) {
            this.updatePrice();
          }
        } else {
          this.submitted = false;
          this.alertService.showSuccess(res.message);
          this.modalClose();          
          this.selectedItems = [];
          this.tempSelectedItems = [];
          this.disableSelectParent = false;
          this.searchProductStore();
        }
      } catch (error) {
        this.submitted = false;
        this.alertService.showMess(error);
      }
      
    } 
  }

  async onUpdateStatusProduct(status) {
    this.submitted = true;
    
    let dataUpdateStatus = new UpdateStatusProductDto();
    dataUpdateStatus.channel_id = parseInt(this.searchForm.channel_id);
    dataUpdateStatus.products = this.selectedItems.map(x => {return x.id}) as [number];
    dataUpdateStatus.status = status;
    dataUpdateStatus.select_all = this.retrieveForm.retrieve_all;
    let confirmMessage = 'Bạn có chắc chắn cập nhật trạng thái các số?'
    let res;
    if ((await this.alertService.showConfirm(confirmMessage)).value) {
      this.sectionBlockUI.start();
      this.inventoryService.updateStatusProduct(dataUpdateStatus).subscribe(res => {        
        this.sectionBlockUI.stop();
        this.submitted = false;
        this.alertService.showMess(res.message);
      }, error => {
        this.sectionBlockUI.stop();
        this.submitted = false;
        this.alertService.showMess(error);
      })
    }
  }

  /**
   * Cập nhật giá
   * 
   * @returns 
   */
  async updatePrice() {
    this.dataUpdatePrice.confirm = true;
    this.inventoryService.updatePriceProduct(this.dataUpdatePrice).subscribe(res => {
      this.submitted = false;
      if (!res.status) {
        this.alertService.showMess(res.message);
      }
      this.alertService.showSuccess(res.message);
      this.modalClose();      
      this.selectedItems = [];
      this.tempSelectedItems = [];
      this.disableSelectParent = false;
      this.searchProductStore();
    }, error => {
      this.submitted = false;
      this.alertService.showMess(error);
    })

  }

  //cập nhật giá theo file excel
  async onFileChangeExcel(event) {
    this.fileExcelPrice = event.target.files[0];
  }

  async onSubmitUpdatePriceBatch() {
    if(!this.searchForm.channel_id) {
      this.alertService.showMess("Vui lòng chọn kho cần cập nhật giá bán");
      return;
    }
    if(!this.fileExcelPrice) {
      this.alertService.showMess("Vui lòng chọn file");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có chắc chắn cập nhật giá theo file excel")).value) {
      this.submitted = true;
      this.itemBlockUI.start();
      let formData = new FormData();
      formData.append("files", this.fileExcelPrice);
      formData.append("channel_id", this.searchForm.channel_id);
      this.inventoryService.updateProductPriceBatch(formData).subscribe(res => {
        this.itemBlockUI.stop();
        this.submitted = false;
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }        
        if(res.data.product_update_fail.length < 1) {
          this.alertService.showSuccess(res.message, 4500);
        } else {
          const shortMess = `${res.data.product_update_fail.length} sản phẩm không cập nhật được`
          let html = `<div class="html-messsage"><p>${shortMess}</p><table class="table"><thead><tr><th>#</th><th>Name</th></tr></thead><tbody>`;
          let i = 1;
          for(let item of res.data.product_update_fail) {
            html += `<tr><td>${i}</td><td>${item}</td></tr>`;
            i++;
          }
          html+= '</tbody></table></div>';
          this.alertService.showHtml(html, 'success', res.message)
        }
        
        this.modalClose();      
        this.selectedItems = [];
        this.tempSelectedItems = [];
        this.disableSelectParent = false;
        this.searchProductStore();
      },error => {
        this.itemBlockUI.stop();
        this.submitted  = false;
        this.alertService.showMess(error);
      })
    }    

  }

  async onSubmitUpdateAttributeBatch() {
    if(!this.searchForm.channel_id) {
      this.alertService.showMess("Vui lòng chọn kho cần cập nhật sản phẩm");
      return;
    }
    if(!this.fileExcelPrice) {
      this.alertService.showMess("Vui lòng chọn file");
      return;
    }
    if ((await this.alertService.showConfirm("Bạn có chắc chắn cập nhật theo file excel")).value) {
      this.submitted = true;
      this.itemBlockUI.start();
      let formData = new FormData();
      formData.append("files", this.fileExcelPrice);
      formData.append("channel_id", this.searchForm.channel_id);
      this.inventoryService.updateProductAttributeBatch(formData).subscribe(res => {
        this.itemBlockUI.stop();
        this.submitted = false;
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }        
        if(res.data.product_update_fail.list.length < 1) {
          this.alertService.showSuccess(res.message, 4500);
        } else {
          this.listProductFail = res.data.product_update_fail.list.map(x => { return {name: x} });
          this.reasonFail = res.data.product_update_fail.reason;
          return;
        }
        
        this.modalClose();      
        this.selectedItems = [];
        this.tempSelectedItems = [];
        this.disableSelectParent = false;
        this.searchProductStore();
      },error => {
        this.itemBlockUI.stop();
        this.submitted  = false;
        this.alertService.showMess(error);
      })
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
    this.inventoryService.viewDetailSell(parseInt(this.searchForm.channel_id)).subscribe(res => {
      this.currentChannel = res.data.items[0];
    })
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
  }  

}
