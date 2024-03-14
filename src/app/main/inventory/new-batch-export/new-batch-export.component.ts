import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CreateBatchExportDto, RetrieveAllSellChannelDto, RetrieveSellChannelDto, UpdateBatchExportDto } from 'app/auth/service/dto/inventory.dto';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BatchType } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-new-batch-export',
  templateUrl: './new-batch-export.component.html',
  styleUrls: ['./new-batch-export.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewBatchExportComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @BlockUI('section-block') sectionBlockUI: NgBlockUI;
  
  public contentHeader = {
    headerTitle: 'Tạo phiếu xuất kho',
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
          name: 'Danh sách phiếu',
          isLink: true,
          link: '/inventory/batch'
        },
        {
          name: 'Tạo phiếu xuất kho',
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
    take: ''
  }
  seachMyChannel = {
    user_id: '',
    channel_id: ''
  }

  public searchFormProduct = {
    keyword: '',
    page: 1,
    skip: 0,
    take: 1000,
    channel_id: ''
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
  public listChannel;
  public listInputChannel;
  public submitted: boolean = false;
  public listAttribute = [
    {id: 1, name: 'BRONE'},
    {id: 1, name: 'GOLD'},
    {id: 1, name: 'PLATILUM'},
  ]
  selectedAttributes: any;
  disableSelectParent: boolean = false;
  listBatchType = BatchType;
  typeCurrentBatch;
  titleFromChannel = 'Kho xuất đi';  
  serverPaging = {
    total_items: '',    
  }
  dataRetrieveFile = {
    attached_file_name: '',
    attached_file_content: ''
  };

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly alertService: SweetAlertService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly commonService: CommonService
  ) { }

  onSelect(event) {
    console.log(event);
    const selected = event.selected
    this.tmpSelected = [];
    console.log('Select Event', selected, this.tmpSelected);
    
    this.tmpSelected.splice(0, this.tmpSelected.length);
    Array.prototype.push.apply(this.tmpSelected, selected);   
    console.log(this.tmpSelected);
    
    
  }

  onAddItems() {
    Array.prototype.push.apply(this.selectedItems,this.tmpSelected);  
    this.selectedItems = [...this.selectedItems]  
    const arrayNameProduct = this.tmpSelected.map(x => {return x.name});
    this.list = this.list.filter(x => !arrayNameProduct.includes(x.name));
    this.tempList = [...this.list];
    console.log(this.selectedItems);
    console.log(this.list);
    this.tempSelectedItems =[...this.selectedItems];
    this.disableSelectParent = true;
  }

  onSelectToRemove({ selected }) {

  }

  onRemove(item) {
    const index = this.selectedItems.find(x => x.name == item);
    this.list.push(this.selectedItems[index]);
    this.list = [...this.list];
    this.tempList = [...this.list];
    console.log(item);
    this.selectedItems.splice(index, 1);
    this.tempSelectedItems = [...this.selectedItems];
    if(this.selectedItems.length < 1) {
      this.disableSelectParent = false;
    }
  }

  filterList(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempList.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.list = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  filterListSeleted(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tmpSelected.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.selectedItems = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  onChangeParentChannel() {
    this.seachMyChannel.channel_id = this.searchForm.channel_id;
    this.inventoryService.getMyChannel(this.seachMyChannel).subscribe(res => {
      this.listInputChannel = res.data.items;
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
    if (this.typeCurrentBatch == BatchType.RETRIEVE) {
      if(this.searchFormProduct.take > 3000) {
        this.searchFormProduct.take = 3000;
      }
      this.searchFormProduct.page = page && page.offset ? page.offset + 1 : 1;
      this.searchFormProduct.skip = (this.searchFormProduct.page - 1) * this.searchFormProduct.take;
      this.searchFormProduct.channel_id = this.searchForm.channel_id;
      
      this.inventoryService.getAllSim(this.searchFormProduct).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        const data = res.data.data;
        this.serverPaging.total_items = data.count;
        this.tempList = data.items;
        this.list = data.items;
      }, error => {
        this.alertService.showMess(error);
        this.sectionBlockUI.stop();
      })
    } else {
      let paramSearch = {...this.searchForm}
      for(let key in paramSearch) {
        if(paramSearch[key] === '') {
          delete paramSearch[key];
        }
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
  }

  onChangeInputKeywordSearch(event) {
    console.log(event);
    this.searchFormProduct.keyword = event.target.value;
    this.searchProductStore();
  }

  async onSubmitCreate() {
    this.submitted = true;
    if(!this.searchForm.channel_id && this.typeCurrentBatch == BatchType.OUTPUT) {
      this.alertService.showMess("Vui lòng chọn kho xuất đi");
      return;
    }
    if(!this.searchForm.channel_id && this.typeCurrentBatch == BatchType.RETRIEVE) {
      this.alertService.showMess("Vui lòng chọn kho cần thu hồi");
      return;
    }
    if(this.typeCurrentBatch == BatchType.OUTPUT) {
      this.createBatchOutput();
    } else if (this.typeCurrentBatch == BatchType.RETRIEVE) {
      if ((await this.alertService.showConfirm('Bạn có chắc chắn thu hồi các số của kho?')).value) {
        this.createBatchRetrieve();
      }      
    }
  }

  /**
   * Xuất kho
   * 
   * @returns 
   */
  async createBatchOutput() {
    if(!this.createBatchExportForm.to_channel_id ) {
      this.alertService.showMess("Vui lòng chọn kho xuất đến");
      return;
    }
    const dataCreateBatchExport = new CreateBatchExportDto();
    dataCreateBatchExport.title = this.createBatchExportForm.title;
    dataCreateBatchExport.channel_id = parseInt(this.searchForm.channel_id);
    dataCreateBatchExport.to_channel_id  = parseInt(this.createBatchExportForm.to_channel_id );
    dataCreateBatchExport.user_id = parseInt(this.searchForm.admin_id);
    dataCreateBatchExport.title = this.createBatchExportForm.title;
    dataCreateBatchExport.quantity = this.selectedItems.length;
    // if(!dataCreateBatchExport.channel_id || !dataCreateBatchExport.to_channel_id) {
    //   return;
    // }
    if(this.selectedItems.length < 1) {
      this.alertService.showMess("Vui lòng chọn sản phẩm");
      return;
    }
    let resCreateBatch, resUpdateBatch;
    this.submitted = true;
    this.sectionBlockUI.start();
    try {
      resCreateBatch = await this.inventoryService.createBatchExport(dataCreateBatchExport).toPromise();
      if(!resCreateBatch.status) {
        this.alertService.showMess(resCreateBatch.message);
        this.sectionBlockUI.stop();
        return;
      }
    } catch (error) {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    }
    let dataUpdateBatch = new UpdateBatchExportDto();
    dataUpdateBatch.products = this.selectedItems.map(x => {return x.id});
    dataUpdateBatch.batch_id = resCreateBatch.data.data.id;
    dataUpdateBatch.user_id = this.currentUser.id;
    dataUpdateBatch.action = 'ADD';
    try {
      resUpdateBatch = await this.inventoryService.updateBatchExport(dataUpdateBatch).toPromise();
      if(!resUpdateBatch.status) {
        this.alertService.showMess(resUpdateBatch.message);
        this.sectionBlockUI.stop();
        return;
      }
      this.alertService.showSuccess(resUpdateBatch.message);
      this.sectionBlockUI.stop();
      this.router.navigate(['/inventory/batch']);
      return;
    } catch (error) {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    }
  }
  
  /**
   * Thu hồi
   */
  createBatchRetrieve() {
    if (this.retrieveForm.retrieve_all) {
      let dataRetrieve = new RetrieveAllSellChannelDto();
      dataRetrieve.attached_file_content = this.dataRetrieveFile.attached_file_content;
      dataRetrieve.attached_file_name = this.dataRetrieveFile.attached_file_name;
      dataRetrieve.channel_id = parseInt(this.searchFormProduct.channel_id);      
      this.inventoryService.retrieveChannel(dataRetrieve).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.router.navigate(['/inventory/batch']);
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    } else {
      let dataRetrieve = new RetrieveSellChannelDto();
      dataRetrieve.attached_file_content = this.dataRetrieveFile.attached_file_content;
      dataRetrieve.attached_file_name = this.dataRetrieveFile.attached_file_name;
      dataRetrieve.channel_id = parseInt(this.searchFormProduct.channel_id);
      dataRetrieve.product_ids = this.selectedItems.map(x => { return parseInt(x.id) });
      this.inventoryService.retrieveProductOfChannel(dataRetrieve).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.alertService.showSuccess(res.message);
        this.router.navigate(['/inventory/batch']);
      }, error => {
        this.sectionBlockUI.stop();
        this.alertService.showMess(error);
        return;
      })
    }

  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      const ext = event.target.files[0].type;
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.dataRetrieveFile.attached_file_name = event.target.files[0].name;
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.dataRetrieveFile.attached_file_content = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.dataRetrieveFile.attached_file_name = event.target.files[0].name;
        this.dataRetrieveFile.attached_file_content = (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '');
      }
    }
    // if (event.target.files && event.target.files[0]) {
    //   let img = await this.commonService.resizeImage(event.target.files[0]);
    //   this.dataCreatePayment.file = (img+'').replace('data:image/png;base64,', '')
    // }
  }

  //init data
  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser) {
      this.seachMyChannel.user_id = this.currentUser.id;
      this.searchForm.admin_id = this.currentUser.id;
    }
    this.inventoryService.getMyChannel(this.seachMyChannel).subscribe(res => {
      this.listChannel = res.data.items;
      if(this.typeCurrentBatch == BatchType.RETRIEVE) {
        this.listChannel = this.listChannel.filter(x => x.parent_id != null)
      }
    })
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;    
    this.typeCurrentBatch = data && data.type ? data.type : BatchType.OUTPUT;
    console.log(data, this.typeCurrentBatch);
    if(this.typeCurrentBatch == BatchType.RETRIEVE) {
      this.contentHeader.headerTitle = 'Thu hồi';
      this.contentHeader.breadcrumb.links[2].name = 'Thu hồi';
      this.titleFromChannel = 'Kho cần thu hồi';
    }
    this.getData();
  }  

}
