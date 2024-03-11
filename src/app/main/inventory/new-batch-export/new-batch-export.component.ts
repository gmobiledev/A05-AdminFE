import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-batch-export',
  templateUrl: './new-batch-export.component.html',
  styleUrls: ['./new-batch-export.component.scss']
})
export class NewBatchExportComponent implements OnInit {
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
  };;
  constructor() { }

  ngOnInit(): void {
  }

  

}
