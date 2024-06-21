import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { CreateBatchExportDto, CreateBatchRetrieveDto, RetrieveAllSellChannelDto, RetrieveSellChannelDto, UpdateBatchDto, UpdateBatchExportDto } from 'app/auth/service/dto/inventory.dto';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BatchType, ExportType, MAXIMUM_VALUE } from 'app/utils/constants';
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
  @ViewChild('fileExcel') fileExcel: ElementRef;
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
    take: MAXIMUM_VALUE.ROW_QUERY_PRODUCT_BATCH,
    level: '',
    batch_id: '',
    batch_type: BatchType.OUTPUT
  }
  seachMyChannel = {
    user_id: '',
    channel_id: '',
    page_size: MAXIMUM_VALUE.ROW_QUERY_PRODUCT_BATCH
  }

  public searchFormProduct = {
    keyword: '',
    page: 1,
    skip: 0,
    take: MAXIMUM_VALUE.ROW_QUERY_PRODUCT_BATCH,
    channel_id: '',
    level: '',
    key_from: '',
    key_to: '',
    brand: '',
    category_id: '',    
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
  public listChannelTmp;
  public listInputChannel;
  public submitted: boolean = false;
  public listAttribute = [

  ]
  selectedAttributes: any;
  selectedBatch;
  searchBatch = {
    keyword: '',
    channel_id: '',
    type: ''
  };
  isNgSelectBatchOpen = false;
  isLoadingBatch = false;
  disableSelectParent: boolean = false;
  listBatchType = BatchType;
  typeCurrentBatch;
  titleFromChannel = 'Kho xuất đi';
  serverPaging = {
    total_items: '',
  }
  dataRetrieveFile = {
    attached_file_name: '',
    attached_file_content: '',
    file_ext: ''
  };
  selectedFiles;
  currentExcelFileSearch;
  listBatchImport;

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly alertService: SweetAlertService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly commonService: CommonService,
    private readonly commonDataService: CommonDataService
  ) { }

  onSelect(event) {
    console.log(event);
    const selected = event.selected
    this.tmpSelected = [];
    console.log('Select Event', selected, this.tmpSelected);

    this.tmpSelected.splice(0, this.tmpSelected.length);
    Array.prototype.push.apply(this.tmpSelected, selected);
    event.selected = [];
    console.log(this.tmpSelected);
  }

  onChangeCategory(event) {
    if (event.target.value == 2) {
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

  onAddItems() {
    console.log(this.list, this.tmpSelected);
    if (this.tmpSelected.length > 0) {
      Array.prototype.push.apply(this.selectedItems, this.tmpSelected);
      this.selectedItems = [...this.selectedItems]
      const arrayNameProduct = this.tmpSelected.map(x => { return x.id });
      this.list = this.list.filter(x => !arrayNameProduct.includes(x.id));
      this.tempList = this.tempList.filter(x => !arrayNameProduct.includes(x.id));
      this.tempList = [...this.tempList];
      // this.tempList = this.isResetTempList  ? [...this.list] : [...this.tempList];
      this.list = [...this.list];
      console.log(this.selectedItems);
      console.log(this.list);
      this.tempSelectedItems = [...this.selectedItems];
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
    console.log(item, this.selectedItems, index, this.selectedItems[index]);
    this.list.push(this.selectedItems[index]);
    this.list = [...this.list];
    this.tempList = [...this.list];
    console.log(this.tempList);
    this.selectedItems.splice(index, 1);
    this.tempSelectedItems = [...this.selectedItems];
    if (this.selectedItems.length < 1) {
      this.selectedItems = [];
      this.tempSelectedItems = [];
      this.disableSelectParent = false;
    }
  }

  filterList(event) {
    console.log(this.list);

    const val = event.target.value.toLowerCase();
    if (val) {
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
    const currentChannel = this.listChannel.find(x => x.id == this.seachMyChannel.channel_id);
    this.searchBatch.channel_id = this.searchForm.channel_id;    
    this.inventoryService.getMyChannel(this.seachMyChannel).subscribe(res => {
      this.listInputChannel = res.data.items;
      console.log("currentChannel", currentChannel);
      if (currentChannel.export_type == ExportType.P2P) {
        const listAppend = this.listChannel.filter(x => x.id != currentChannel.id);
        this.listInputChannel = [...res.data.items, ...listAppend];
        console.log(listAppend);
      }
    }, error => {
      this.alertService.showMess(error);
    });
    this.getListBatchToExport();
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
      this.searchFormProduct.page = page && page.offset ? page.offset + 1 : 1;
      this.searchFormProduct.skip = (this.searchFormProduct.page - 1) * this.searchFormProduct.take;
      this.searchFormProduct.channel_id = this.searchForm.channel_id;
      this.searchFormProduct.level = this.selectedAttributes !== null && this.selectedAttributes != undefined ? this.selectedAttributes : '';      
      this.searchFormProduct.category_id = this.searchForm.category_id;
      this.searchFormProduct.brand = this.searchForm.brand;
      this.searchFormProduct.key_from = this.searchForm.key_from;
      this.searchFormProduct.key_to = this.searchForm.key_to;
      this.searchFormProduct.status_array = [0, 2];
      this.inventoryService.getProductFromChild(this.searchFormProduct).subscribe(res => {
        this.sectionBlockUI.stop();
        if (!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        const data = res.data;
        this.serverPaging.total_items = data.count;
        this.tempList = data.items.filter(x => x.status != 1);
        this.list = data.items.filter(x => x.status != 1);
      }, error => {
        this.alertService.showMess(error);
        this.sectionBlockUI.stop();
      })
    } else {
      if (this.currentExcelFileSearch) {
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
      this.searchForm.level = this.selectedAttributes !== null && this.selectedAttributes != undefined ? this.selectedAttributes : '';
      this.searchForm.batch_id = this.selectedBatch !== null && this.selectedBatch != undefined ? this.selectedBatch : '';
      console.log(this.selectedAttributes);
      let paramSearch = { ...this.searchForm }
      for (let key in paramSearch) {
        if (paramSearch[key] === '') {
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
    if (!this.searchForm.channel_id && this.typeCurrentBatch == BatchType.OUTPUT) {
      this.alertService.showMess("Vui lòng chọn kho xuất đi");
      this.submitted = false;
      return;
    }
    if (!this.searchForm.channel_id && this.typeCurrentBatch == BatchType.RETRIEVE) {
      this.alertService.showMess("Vui lòng chọn kho cần thu hồi");
      this.submitted = false;
      return;
    }
    if (!this.selectedFiles && this.typeCurrentBatch == BatchType.RETRIEVE) {
      this.alertService.showMess("Vui lòng đính kèm chứng từ");
      this.submitted = false;
      return;
    }
    if (this.typeCurrentBatch == BatchType.OUTPUT) {
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
    if (!this.createBatchExportForm.to_channel_id) {
      this.alertService.showMess("Vui lòng chọn kho xuất đến");
      return;
    }
    const dataCreateBatchExport = new CreateBatchExportDto();
    dataCreateBatchExport.title = this.createBatchExportForm.title;
    dataCreateBatchExport.channel_id = parseInt(this.searchForm.channel_id);
    dataCreateBatchExport.to_channel_id = parseInt(this.createBatchExportForm.to_channel_id);
    dataCreateBatchExport.user_id = parseInt(this.searchForm.admin_id);
    dataCreateBatchExport.title = this.createBatchExportForm.title;
    dataCreateBatchExport.quantity = this.selectedItems.length;

    let formDataCreate = new FormData();
    for (let key in dataCreateBatchExport) {
      formDataCreate.append(key, dataCreateBatchExport[key]);
    }
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let itemF of this.selectedFiles) {
        formDataCreate.append("files", itemF);
      }
    }

    if (this.selectedItems.length < 1) {
      this.submitted = false;
      this.alertService.showMess("Vui lòng chọn sản phẩm");
      return;
    }
    let resCreateBatch, resUpdateBatch;
    this.submitted = true;
    this.sectionBlockUI.start();
    try {
      resCreateBatch = await this.inventoryService.createBatchExport(formDataCreate).toPromise();
      if (!resCreateBatch.status) {
        this.alertService.showMess(resCreateBatch.message);
        this.submitted = false;
        this.sectionBlockUI.stop();
        return;
      }
    } catch (error) {
      this.alertService.showMess(error);
      this.submitted = false;
      this.sectionBlockUI.stop();
    }
    let dataUpdateBatch = new UpdateBatchExportDto();
    dataUpdateBatch.products = this.selectedItems.map(x => { return x.id });
    dataUpdateBatch.batch_id = resCreateBatch.data.data.id;
    dataUpdateBatch.user_id = this.currentUser.id;
    dataUpdateBatch.action = 'ADD';
    try {
      resUpdateBatch = await this.inventoryService.updateBatchExport(dataUpdateBatch).toPromise();
      this.submitted = false;
      if (!resUpdateBatch.status) {
        this.alertService.showMess(resUpdateBatch.message);
        this.sectionBlockUI.stop();
        return;
      }
      this.alertService.showSuccess(resUpdateBatch.message);
      this.sectionBlockUI.stop();
      this.router.navigate(['/inventory/batch']);
      return;
    } catch (error) {
      this.submitted = false;
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    }
  }

  /**
   * Thu hồi
   */
  async createBatchRetrieve() {
    if (this.selectedItems.length < 1) {
      this.submitted = false;
      this.alertService.showMess("Vui lòng chọn sản phẩm");
      return;
    }
    //call api moi
    const selectedChannel = this.listChannel.find(x => x.id == this.searchFormProduct.channel_id);
    const parentChannel = this.listChannelTmp.find(x => x.id == selectedChannel.parent_id);
    const dataCreateBatch = new CreateBatchRetrieveDto();
    dataCreateBatch.title = this.createBatchExportForm.title;
    dataCreateBatch.channel_id = parseInt(selectedChannel.parent_id);
    dataCreateBatch.from_channel_id = selectedChannel.id
    dataCreateBatch.title = `Thu hồi về kho ${parentChannel.name}`;
    dataCreateBatch.quantility = this.selectedItems.length;
    dataCreateBatch.products = this.selectedItems.map(x => { return x.id });
    dataCreateBatch.files = this.dataRetrieveFile.attached_file_content;
    dataCreateBatch.file_ext = this.dataRetrieveFile.file_ext;

    let formDataCreate = new FormData();
    for (let key in dataCreateBatch) {
      formDataCreate.append(key, dataCreateBatch[key]);
    }
    if (this.selectedFiles && this.selectedFiles.length > 0) {
      for (let itemF of this.selectedFiles) {
        formDataCreate.append("files", itemF);
      }
    }

    let resCreateBatch;
    this.submitted = true;
    this.sectionBlockUI.start();
    try {
      resCreateBatch = await this.inventoryService.createBatchRetrieve(formDataCreate).toPromise();
      this.submitted = false;
      this.sectionBlockUI.stop();
      if (!resCreateBatch.status) {
        this.alertService.showMess(resCreateBatch.message);
        return;
      }
      this.alertService.showSuccess(resCreateBatch.message);
      this.router.navigate(['/inventory/batch']);

    } catch (error) {
      this.alertService.showMess(error);
      this.submitted = false;
      this.sectionBlockUI.stop();
    }
  }

  async onSelectFileFront(event) {
    if (this.typeCurrentBatch == this.listBatchType.RETRIEVE) {
      if (event.target.files && event.target.files[0]) {
        console.log(event.target.files[0]);
        const ext = event.target.files[0].type;
        if (ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
          this.dataRetrieveFile.file_ext = 'png';
          this.dataRetrieveFile.attached_file_name = event.target.files[0].name;
          let img = await this.commonService.resizeImage(event.target.files[0]);
          this.dataRetrieveFile.attached_file_content = (img + '').replace('data:image/png;base64,', '')
        } else if (ext.includes('pdf')) {
          this.dataRetrieveFile.file_ext = 'pdf';
          this.dataRetrieveFile.attached_file_name = event.target.files[0].name;
          this.dataRetrieveFile.attached_file_content = (await this.commonService.fileUploadToBase64(event.target.files[0]) + '').replace('data:application/pdf;base64,', '');
        }
      }
    }
    this.selectedFiles = event.target.files;
    // if (event.target.files && event.target.files[0]) {
    //   let img = await this.commonService.resizeImage(event.target.files[0]);
    //   this.dataCreatePayment.file = (img+'').replace('data:image/png;base64,', '')
    // }
  }

  onSelectFileExcel(event) {
    if (!this.searchForm.channel_id) {
      this.alertService.showMess("Vui lòng chọn kho cần xuất đi");
      return;
    }

    if (event.target.files && event.target.files[0]) {
      this.sectionBlockUI.start();
      this.currentExcelFileSearch = event.target.files[0];
      let formData = new FormData();

      for (let key in this.searchForm) {
        if (this.searchForm[key] !== '') {
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
      }, error => {
        this.sectionBlockUI.stop();
        this.fileExcel.nativeElement.value = "";
        this.alertService.showMess(error);

      })
    }
  }

  onRemoveFileExcel() {
    this.currentExcelFileSearch = null;
  }

  //init data
  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (this.currentUser) {
      this.seachMyChannel.user_id = this.currentUser.id;
      this.searchForm.admin_id = this.currentUser.id;
    }
    this.sectionBlockUI.start();
    this.inventoryService.getMyChannel(this.seachMyChannel).subscribe(async res => {
      this.listChannel = res.data.items;
      this.listChannelTmp = res.data.items;
      if (this.typeCurrentBatch == BatchType.RETRIEVE) {
        let childChannels = [];
        let params = {
          page_size: 1000,
          channel_ids: this.listChannel.map(x => x.id)
        }
        let res = await this.inventoryService.getMyChannel(params).toPromise();
        Array.prototype.push.apply(childChannels, res.data.items);
        // for(let item of this.listChannel) {
        //   let params = {
        //     page_size: 1000,
        //     channel_id: this.listChannel
        //   }
        //   let res = await this.inventoryService.getMyChannel({channel_id: item.id, page_size: 1000}).toPromise();
        //   Array.prototype.push.apply(childChannels,res.data.items); 
        // }
        this.listChannel = [...childChannels];
        this.listChannel = this.listChannel.filter(x => x.parent_id != null)
      }
      this.sectionBlockUI.stop();
    }, error => {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    })
  }

  getListBatchToExport(isShow = false) {
    this.isLoadingBatch = true;
    this.inventoryService.getListBatchToExport(this.searchBatch).subscribe(res => {
      this.listBatchImport = res.data.items;
      this.isLoadingBatch = false;
      this.isNgSelectBatchOpen = isShow;
    })
  }

  onBlurSelectBatch() {
    this.searchBatch.keyword = '';
    if(this.searchForm.channel_id) {
      this.getListBatchToExport();
    }    
  }

  onSearchSelectBatch(event) {
    this.searchBatch.keyword = event.term;
    if(this.searchForm.channel_id) {
      this.getListBatchToExport(true)
    }
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.typeCurrentBatch = data && data.type ? data.type : BatchType.OUTPUT;
    this.searchBatch.type = this.typeCurrentBatch
    console.log(data, this.typeCurrentBatch);
    if (this.typeCurrentBatch == BatchType.RETRIEVE) {
      this.searchForm.batch_type = BatchType.RETRIEVE;
      this.contentHeader.headerTitle = 'Thu hồi';
      this.contentHeader.breadcrumb.links[2].name = 'Thu hồi';
      this.titleFromChannel = 'Kho cần thu hồi';
    }
    this.getData();    
  }

}
