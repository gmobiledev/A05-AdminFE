import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductConstant, ProductStatus, ProductStoreStatus, STORAGE_KEY, TaskTelecom, TaskTelecomStatus } from 'app/utils/constants';
import { SweetAlertService } from 'app/utils/sweet-alert.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import dayjs from 'dayjs';
import { InventoryService } from 'app/auth/service/inventory.service';
import { CommonService } from 'app/utils/common.service';

@Component({
  selector: 'app-active-product',
  templateUrl: './active-product.component.html',
  styleUrls: ['./active-product.component.scss']
})
export class ActiveProductComponent implements OnInit {

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
  public listChannel: any;

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
    private alertService: SweetAlertService

  ) {}

  onSubmitSearch() {
    if (!this.searchForm.channelId && this.listChannel?.length) {
      this.searchForm.channelId = this.listChannel[0].id;
    }
    if (this.dateRange?.startDate && this.dateRange?.endDate) {
      const tzoffset = new Date().getTimezoneOffset() * 60000;
      this.searchForm.fromDate = new Date(
        new Date(this.dateRange.startDate.toISOString()).getTime() - tzoffset
      ).toISOString().slice(0, 10);
      this.searchForm.toDate = new Date(
        new Date(this.dateRange.endDate.toISOString()).getTime() - tzoffset
      ).toISOString().slice(0, 10);
    } else {
      this.searchForm.fromDate = '';
      this.searchForm.toDate = '';
    }

    this.searchForm.page = 1;
    this.loadData();
  }

loadData() {
  this.inventoryService.getMyChannel({}).subscribe(res => {
    this.listChannel = res.data.items;

    // Nếu chưa có channelId thì lấy cái đầu tiên
    if (!this.searchForm.channelId && this.listChannel.length) {
      this.searchForm.channelId = this.listChannel[0].id;
    }

    // Gọi API sau khi đã set xong channelId
    this.inventoryService.getAssignedNumbers(this.searchForm).subscribe(res => {
      if (Array.isArray(res)) {
        this.list = res;
        this.totalItems = res.length;
      } else {
        this.list = res.data || [];
        this.totalItems = res.meta?.total || 0;
      }

      this.totalPage = Math.ceil(this.totalItems / this.searchForm.take);
    });
  });
}

  ngOnInit(): void {
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

