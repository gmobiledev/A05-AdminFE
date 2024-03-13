import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { CreateBatchExportDto, UpdateBatchExportDto } from 'app/auth/service/dto/inventory.dto';
import { InventoryService } from 'app/auth/service/inventory.service';
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
          name: 'Danh sách phiếu xuất',
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
    category_id: ''
  }
  seachMyChannel = {
    user_id: '',
    channel_id: ''
  }

  public createBatchExport = {
    to_channel_id: '',
    channel_id: '',
    quantity: '',
    title: '',
    user_id: ''
  };

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
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly alertService: SweetAlertService,
    private readonly router: Router
  ) { }

  onSelect({ selected }) {
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
    this.tempSelectedItems =[...this.selectedItems] 
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
    })
  }

  // TÌm số trong kho
  searchProductStore() {
    if(!this.searchForm.channel_id) {
      this.alertService.showMess("Vui lòng chọn kho xuất đi");
      return;
    }
    this.sectionBlockUI.start();
    this.inventoryService.searchProductStore(this.searchForm).subscribe(res => {
      this.sectionBlockUI.stop();
      if(!res.status) {
        this.alertService.showMess(res.message);
        return;
      }
      const data = res.data;
      this.tempList = data.items;
      this.list = data.items;
    },error => {
      this.alertService.showMess(error);
      this.sectionBlockUI.stop();
    })
  }

  async onSubmitCreate() {
    this.submitted = true;
    const dataCreateBatchExport = new CreateBatchExportDto();
    dataCreateBatchExport.title = this.createBatchExport.title;
    dataCreateBatchExport.channel_id = parseInt(this.searchForm.channel_id);
    dataCreateBatchExport.to_channel_id  = parseInt(this.createBatchExport.to_channel_id );
    dataCreateBatchExport.user_id = parseInt(this.searchForm.admin_id);
    dataCreateBatchExport.title = this.createBatchExport.title;
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

  //init data
  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(this.currentUser) {
      this.seachMyChannel.user_id = this.currentUser.id;
      this.searchForm.admin_id = this.currentUser.id;
    }
    this.inventoryService.getMyChannel(this.seachMyChannel).subscribe(res => {
      this.listChannel = res.data.items;
    })
  }

  ngOnInit(): void {
    this.getData();
  }  

}
