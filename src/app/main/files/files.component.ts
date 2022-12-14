import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileServive } from 'app/auth/service/file.service';
import { SweetAlertService } from 'app/utils/sweet-alert.service';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  public contentHeader: any;
  public list: any;
  public page: any;
  public total: any;
  public searchForm = {
    keyword: '',
    is_signed: ''
  }
  public isViewFile: boolean = false;
  public urlFile: any;

  constructor(
    private fileService: FileServive,
    private alertService: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.route.queryParams.subscribe(params => {
      this.searchForm.keyword = params['keyword'] && params['keyword'] != undefined ? params['keyword'] : '';
      this.searchForm.is_signed = params['is_signed'] && params['is_signed'] != undefined ? params['is_signed'] : '';

      this.getData();
    })
  }

  onSubmitSearch(): void {
    this.isViewFile = false;
    this.router.navigate(['/files'], { queryParams: this.searchForm})
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách files',
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
            name: 'Danh sách files',
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
    this.fileService.getByUserInfo(this.searchForm).subscribe(res => {
      this.list = res.data.items;
      this.total = res.data.count;
    }, error => {
      console.log("ERRRR");
      console.log(error);
    })
  }

}
