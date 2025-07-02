import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import dayjs from 'dayjs';
import { InventoryService } from 'app/auth/service/inventory.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-active-product',
  templateUrl: './active-product.component.html',
  styleUrls: ['./active-product.component.scss']
})
export class ActiveProductComponent implements OnInit {
  @ViewChild('modalUpdateSim') modalUpdateSim: any;

  public contentHeader: any = {
    headerTitle: 'Danh sách số đã sử dụng',
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
          name: 'Danh sách số đã sử dụng',
          isLink: false
        }
      ]
    }
  };

  public selectedSim: any;
  public modalRef: any;
  listSellChannel: any[] = [];
  listUnit: any[] = [];

  list: any[] = [];
  totalPage = 0;

  searchForm = {
    search: '',
    channelName: '',
    channelId: '',
    assignedUser: '',
    fromDate: '',
    toDate: '',
    take: 20,
    page: 1
  };

  dateRange: any;
  ranges: any = {
    'Hôm nay': [dayjs(), dayjs()],
    'Hôm qua': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Tuần vừa qua': [dayjs().subtract(6, 'days'), dayjs()],
    'Tháng này': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Tháng trước': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
  public totalItems: number;

  constructor(
    private inventoryService: InventoryService,
    private alertService: SweetAlertService,
    private readonly modalService: NgbModal,
  ) {}

  onSubmitSearch() {
    if (this.dateRange?.startDate && this.dateRange?.endDate) {
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      this.searchForm.fromDate = new Date(new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset)
        .toISOString();

      const endDateLocal = new Date(this.dateRange.endDate);
      endDateLocal.setHours(23, 59, 59, 999);
      this.searchForm.toDate = new Date(endDateLocal.getTime() - tzoffset).toISOString();
    } else {
      this.searchForm.fromDate = '';
      this.searchForm.toDate = '';
    }

    this.searchForm.page = 1;
    this.loadData();
  }

  getUnitName(unit_id: number): string {
    const unit = this.listUnit.find(u => u.id === unit_id);
    return unit ? unit.name : 'Chưa có đơn vị';
  }

  openViewSimModal(modalTemplate: any, sim: any) {
    this.selectedSim = sim;

    this.modalRef = this.modalService.open(modalTemplate, {
      centered: true,
      size: 'lg',
      backdrop: 'static',
      keyboard: false
    });
  }

  loadData() {
    this.inventoryService.getAllUnits().subscribe(res => {
      this.listUnit = res.data || res;
    });
    this.inventoryService.getAssignedNumbers(this.searchForm).subscribe(res => {
      this.list = res.data || [];
      this.totalPage = res.length || 0;
      this.totalItems = res.total
    });
  }

  ngOnInit(): void {
    this.inventoryService.listSellChannelAll().subscribe(res => {
      this.listSellChannel = [
        { id: '', name: 'Tất cả kho' },
        ...res.data.items
      ];
    });
    this.loadData();
  }

  loadPage(page: any) {
    const parsed = parseInt(page, 20);
    if (!isNaN(parsed) && parsed > 0) {
      this.searchForm.page = parsed;
      this.loadData();
    }
  }

  exportExcel() {
    const params: any = {
      search: this.searchForm.search || '',
      channelName: this.searchForm.channelName || '',
      assignedUser: this.searchForm.assignedUser || '',
      fromDate: this.searchForm.fromDate || '',
      toDate: this.searchForm.toDate || ''
    };

    this.inventoryService.exportAssignedNumbersExcel(params).subscribe({
      next: (response) => {
        const blob = new Blob([response.body], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        // Nếu muốn lấy tên file từ header (nếu server set)
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'danhsachso.xlsx';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="?([^"]+)"?/);
          if (match?.[1]) fileName = match[1];
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      error: (err) => {
        console.error(err);
        this.alertService.showMess('Xuất Excel thất bại');
      }
    });
  }

}

