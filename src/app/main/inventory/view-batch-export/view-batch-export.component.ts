import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { UserService } from 'app/auth/service';
import { AdminService } from 'app/auth/service/admin.service';
import { CommonDataService } from 'app/auth/service/common-data.service';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';
import { BatchStatus, BatchType } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
const ExcelJS = require('exceljs');
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-batch-export',
  templateUrl: './view-batch-export.component.html',
  styleUrls: ['./view-batch-export.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewBatchExportComponent implements OnInit {

  @ViewChild(DatatableComponent) table: DatatableComponent;
  @ViewChild('modalAttachments') modalAttachments;

  public contentHeader = {
    headerTitle: 'Chi tiết phiếu',
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
          name: 'Chi tiết phiếu',
          isLink: false
        }
      ]
    }
  };

  modalRef: any;
  batchStatus = BatchStatus;
  listCurrentAction: any;
  currentUser: any;
  id: any;
  data: any;
  fromChannel: any;
  toChannel: any;
  tempList: any;
  listProducts: any;
  adminCreator: any;
  reciever: any;
  public basicSelectedOption: number = 10;
  dataApprove = {
    attached_file_name: '',
    attached_file_content: ''
  }
  batchType = BatchType;
  listFiles = [];
  htmlHeadingText = {
    fromChannel: '',
    toChannel: ''
  }
  fileExt;

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly route: ActivatedRoute,
    private readonly modalService: NgbModal,
    private readonly alertService: SweetAlertService,
    private readonly commonService: CommonService,
    private readonly commonDataService: CommonDataService,
    private readonly adminService: AdminService,
    private readonly userService: UserService,    
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  getData() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
    this.listCurrentAction = this.currentUser.actions;
    this.inventoryService.findOneBatchExport(this.id).subscribe(res => {
      this.data = res.data;
      this.listProducts = res.data.products.items;
      this.tempList = res.data.products.items;
      if(res.data.channels) {
        this.fromChannel = res.data.channels.find(x => x.id == res.data.batch.channel_id);
        this.toChannel = res.data.channels.find(x => x.id == res.data.batch.to_channel_id);
      }

      this.fileExt = 'pdf';
      let files = this.data.batch.attachments ? JSON.parse(this.data.batch.attachments) : null;
      if (files && files.file) {
        const arrayFileExt = files.file.split('.');
        this.fileExt = arrayFileExt[arrayFileExt.length - 1];
      } else {
        this.fileExt = '';
      }

      //lay thong tin admin
      this.adminService.getListAdmin({id: res.data.batch.created_by}).subscribe(res => {
        this.adminCreator = res.data.items[0];
      })

      //thông tin kho xuất tới
      if(this.toChannel && this.toChannel.customer_id) {
        this.userService.searchCustomer({id: this.toChannel.customer_id}).subscribe(res => {
          this.reciever = res.data.items[0];
        })
      }
      if(this.data.batch.type == this.batchType.RETRIEVE) {
        this.htmlHeadingText = {
          fromChannel: 'Thu hồi về kho',
          toChannel: 'Thu hồi từ kho'
        }
      } else if(this.data.batch.type == this.batchType.OUTPUT) {
        this.htmlHeadingText = {
          fromChannel: 'Xuất từ kho',
          toChannel: 'Xuất tới kho'
        }
      }
      
    })

    
  }

  filterList(event) {
    const val = event.target.value.toLowerCase();
    // filter our data
    const temp = this.tempList.filter(function (d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.listProducts = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  checkAction(item) {
    return this.listCurrentAction ? this.listCurrentAction.find(itemX => itemX.includes(item)) : false;
  }

  onViewModalApprove(modal) {
    this.modalRef = this.modalService.open(modal, {
      centered: true,
      windowClass: 'modal modal-primary',
      size: 'lg'
    });
  }

  modalClose() {
    this.modalRef.close();
  }

  async onApprove(item, status, type) {
    let data = {
      batch_id: item.id,
      user_id: this.currentUser.id
    }
    if(type == 'ketoan') {
      if(status == this.batchStatus.APPROVED_BY_ACCOUNTANT) {
        this.inventoryService.ketoanDuyet(data).subscribe(res => {
          if(!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
          this.modalClose();
        },error => {
          this.alertService.showMess(error)
        })
      } else if (status == this.batchStatus.CANCEL_BY_ACCOUNTANT) {
        Swal.fire({
          title: 'Bạn có đồng ý từ chối yêu cầu? Nhập lý do',
          input: 'textarea',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Xác nhận',
          showLoaderOnConfirm: true,
          preConfirm: (note) => {
            if (!note || note == '') {
              Swal.showValidationMessage(
                "Vui lòng nhập nội dung"
              )
              return;
            }
            data['note'] = note;
            this.inventoryService.ketoanReject(data).subscribe(res => {
              if(!res.status) {
                this.alertService.showMess(res.message);
                return;
              }
              this.alertService.showSuccess(res.message);
              this.getData();
            },error => {
              this.alertService.showMess(error)
            })    
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
  
          }
        })  
      }
    } else if (type == 'vanphong') {
      if(status == this.batchStatus.APPROVED) {
        if(!this.dataApprove.attached_file_content) {
          this.alertService.showMess("Vui lòng đính kèm chứng từ");
          return;
        }
        this.inventoryService.vanphongDuyet({...data, ...this.dataApprove}).subscribe(res => {
          if(!res.status) {
            this.alertService.showMess(res.message);
            return;
          }
          this.alertService.showSuccess(res.message);
          this.getData();
          this.modalClose();
        },error => {
          this.alertService.showMess(error)
        })
      } else if (status == this.batchStatus.CANCEL_BY_OFFICE) {

        Swal.fire({
          title: 'Bạn có đồng ý từ chối yêu cầu? Nhập lý do',
          input: 'textarea',
          inputAttributes: {
            autocapitalize: 'off'
          },
          showCancelButton: true,
          confirmButtonText: 'Gửi',
          showLoaderOnConfirm: true,
          preConfirm: (note) => {
            if (!note || note == '') {
              Swal.showValidationMessage(
                "Vui lòng nhập nội dung"
              )
              return;
            }
            data['note'] = note;
            this.inventoryService.vanPhongReject(data).subscribe(res => {
              if(!res.status) {
                this.alertService.showMess(res.message);
                return;
              }
              this.alertService.showSuccess(res.message);
              this.getData();
            },error => {
              this.alertService.showMess(error)
            })  
          },
          allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
          if (result.isConfirmed) {
  
          }
        })
      }
    } else if(type == 'user') {
      let confirmMess = status == this.batchStatus.CANCEL_BY_USER ? 'Bạn có đồng ý từ chối yêu cầu này?' : 'Bạn có đồng ý duyệt yêu cầu này?';
      if ((await this.alertService.showConfirm(confirmMess)).value) {
        if (status == this.batchStatus.APPROVED) {
          this.inventoryService.userDuyet(data).subscribe(res => {
            if (!res.status) {
              this.alertService.showMess(res.message);
              return;
            }
            this.alertService.showSuccess(res.message);
            this.getData();
            this.modalClose();
          }, error => {
            this.alertService.showMess(error)
          })
        } else if (status == this.batchStatus.CANCEL_BY_USER) {

          Swal.fire({
            title: 'Bạn có đồng ý từ chối yêu cầu? Nhập lý do',
            input: 'textarea',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Gửi',
            showLoaderOnConfirm: true,
            preConfirm: (note) => {
              if (!note || note == '') {
                Swal.showValidationMessage(
                  "Vui lòng nhập nội dung"
                )
                return;
              }
              data['note'] = note;
              this.inventoryService.userReject(data).subscribe(res => {
                if (!res.status) {
                  this.alertService.showMess(res.message);
                  return;
                }
                this.alertService.showSuccess(res.message);
                this.getData();
              }, error => {
                this.alertService.showMess(error)
              })  
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
    
            }
          })          
        }
      }
    } else {

    }
    
  }

  async onSelectFileFront(event) {
    if (event.target.files && event.target.files[0]) {
      console.log(event.target.files[0]);
      const ext = event.target.files[0].type;
      if(ext.includes('jpg') || ext.includes('png') || ext.includes('jpeg')) {
        this.dataApprove.attached_file_name = event.target.files[0].name;
        let img = await this.commonService.resizeImage(event.target.files[0]);
        this.dataApprove.attached_file_content = (img + '').replace('data:image/png;base64,', '')
      } else if (ext.includes('pdf')) {
        this.dataApprove.attached_file_name = event.target.files[0].name;
        this.dataApprove.attached_file_content = (await this.commonService.fileUploadToBase64(event.target.files[0])+'').replace('data:application/pdf;base64,', '');
      }
    }
    // if (event.target.files && event.target.files[0]) {
    //   let img = await this.commonService.resizeImage(event.target.files[0]);
    //   this.dataCreatePayment.file = (img+'').replace('data:image/png;base64,', '')
    // }
  }

  async exportExcel() {
    const wb = new ExcelJS.Workbook();
    let link = 'assets/template/phieu_xuat_kho.xlsx';
    this.commonDataService.readFile(link).subscribe(async res => {
      
      let workbook = await wb.xlsx.load(res);
      console.log(workbook, 'workbook instance')
      let workSheet = workbook.getWorksheet('TM04');
      console.log("workSheet", workSheet);
      let dataBrand = this.listProducts.map(x => x.brand);
      let dataInput = [];

      for (let j = 0; j < this.listProducts.length; j++) {
        let typeProduct = 'SIM';
        if (this.listProducts[j].category_id == 3) {
          typeProduct = 'SỐ'
        } else if (this.listProducts[j].category_id == 2) {
          typeProduct = 'SIM'
        }
        let name = typeProduct + ' ' + this.listProducts[j].brand;
        const index = dataInput.findIndex(x => x.name == name);
        if (index != -1) {
          dataInput[index].quantity++;
        } else {
          dataInput.push({
            sku: '',
            name: name,
            quantity: 1,
            note: 'Danh sách tại Phụ Lục'
          })
        }

      }
      

      const startRow = 20;
      let index = 0;
      for (let item of dataInput) {
        var getRowInsert = workSheet.getRow(startRow + index);
        getRowInsert.getCell('A').value = index + 1;
        getRowInsert.getCell('B').value = item.sku;
        getRowInsert.getCell('C').value = item.name;
        getRowInsert.getCell('D').value = item.unit;
        getRowInsert.getCell('E').value = item.quantity;
        getRowInsert.getCell('H').value = item.note;
        getRowInsert.commit();
        index++;
      }

      let cDate = new Date()
      const offset = cDate.getTimezoneOffset()
      cDate = new Date(cDate.getTime() - (offset * 60 * 1000))
      
      //xuat di
      workSheet.getCell('C8').value = this.adminCreator.full_name;
      workSheet.getCell('C12').value = this.adminCreator.mobile;
      workSheet.getCell('C13').value = cDate.toISOString().split('T')[0];

      //nhan hang
      workSheet.getCell('G8').value = this.reciever ? this.reciever.name : this.toChannel.name;
      workSheet.getCell('G12').value = this.adminCreator.mobile;
      // workSheet.getCell('G13').value = cDate.toISOString().split('T')[0];

      const worksheet = workbook.addWorksheet('Phụ Lục');
      worksheet.columns = [
        { letter: 'A', header: 'NAME', key: 'name' },
        { letter: 'B', header: 'LOẠI SP', key: 'category_id' },
        { letter: 'C', header: 'GIÁ', key: 'price' },
        { letter: 'D', header: 'HẠNG', key: 'level' },
        { letter: 'E', header: 'NHÀ MẠNG', key: 'brand' },
      ];

      worksheet.addRows(this.listProducts.map(x => { return { name: x.name, category_id: x.category_id, price: x.price, level: x.level, brand: x.brand } }));
      
      const buffer = await wb.xlsx.writeBuffer();
      var newBlob = new Blob([buffer], { type: 'application/octet-stream' });
      const url = window.URL.createObjectURL(newBlob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = url;
      a.download = "phieu xuat kho.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      return;
    })
  }

  onViewAttachments() {
    let files = this.data.batch.attachments ? JSON.parse(this.data.batch.attachments) : null;
    if(files && files.file) {
      this.inventoryService.viewFile({
        file: files.file
      }).subscribe(res => {
        if(!res.status) {
          this.alertService.showMess(res.message);
          return;
        }
        this.listFiles = [
          {ext: res.data.ext, base64: res.data.base64}
        ];
        this.onViewModalApprove(this.modalAttachments);
      },error => {
        this.alertService.showMess(error);
      })
    } else {
      this.onViewModalApprove(this.modalAttachments);
    }    
    
  }
}
