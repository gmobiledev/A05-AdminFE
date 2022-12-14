import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContractServive } from 'app/auth/service/contract.service';
import { FileServive } from 'app/auth/service/file.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public page: any;
  public total: any;
  public pageSize: any;
  public searchForm = {
    user: '',
    file: '',
    type: '',
    is_customer_sign: '',
    is_guarantee_sign: '',
    is_bank_sign: '',
  }
  public isViewFile: boolean = false;
  public urlFile: any;

  constructor(
    private fileService: FileServive,
    private contractService: ContractServive,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.user = params['user'] && params['user'] != undefined ? params['user'] : '';
      this.searchForm.is_customer_sign = params['is_customer_sign'] && params['is_customer_sign'] != undefined ? params['is_customer_sign'] : '';
      this.searchForm.is_guarantee_sign = params['is_guarantee_sign'] && params['is_guarantee_sign'] != undefined ? params['is_guarantee_sign'] : '';
      this.searchForm.is_bank_sign = params['is_bank_sign'] && params['is_bank_sign'] != undefined ? params['is_bank_sign'] : '';

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.isViewFile = false;
    this.router.navigate(['/contract'], { queryParams: this.searchForm})
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách hợp đồng',
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
            name: 'Danh sách hợp đồng',
            isLink: false
          }
        ]
      }
    };    
  }

  toggleDetails() {
    this.isViewFile = false;
  }

  viewFile(id): void {
    this.fileService.getById(id)
    .subscribe(x => {
      // console.log("XXXX");
      //   console.log(x);
        // this.dataFile = x;
        // return;
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        this.isViewFile = true;
        var newBlob = new Blob([x.body], { type: x.body.type });
        this.urlFile = URL.createObjectURL(newBlob);        
    });
  }

  getData(): void {
    this.contractService.getAll(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.total = res.data.count;
      this.pageSize = res.data.pageSize;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
