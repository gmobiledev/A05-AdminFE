import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'app/auth/service';
import { FileServive } from 'app/auth/service/file.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
  public contentHeader: any;
  public data: any;
  public id: any;
  public listFiles: any;
  public dataFile: any;
  public environment = environment;
  public urlFile: any;
  public isViewFile: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private fileService: FileServive,
    private domSanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Danh sách user',
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
            name: 'Danh sách user',
            isLink: true,
            link: '/admin/users'
          },
          {
            name: 'Chi tiết',
            isLink: false
          }
        ]
      }
    };
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

  getData(): void {
    this.userService.getById(this.id).subscribe(res => {
      this.data = res.data;
    });
    this.userService.getListFiles({user_id: this.id, entity: 'contract'}).subscribe(res => {
      this.listFiles = res.data.items;
    });
    
  }

  showUrl(id) {
    return `${environment.apiUrl}/files/view/${id}`;
  }

  toggleDetails() {
    this.isViewFile = false;
  }

  viewFile(id): void {
    this.userService.viewFile(id)
    .subscribe(res => {
      // console.log("XXXX");
      //   console.log(x);
        // this.dataFile = x;
        // return;
        // It is necessary to create a new blob object with mime-type explicitly set
        // otherwise only Chrome works like it should
        this.isViewFile = true;
        // var newBlob = new Blob([x.body], { type: x.body.type });
        // this.urlFile = URL.createObjectURL(newBlob);   
        const byteArray = new Uint8Array(atob(res.data.base64).split('').map(char => char.charCodeAt(0)));
        const newBlob = new Blob([byteArray], {type: res.data.file_type});
        // this.fileType = res.data.file_type;
        this.urlFile = URL.createObjectURL(newBlob);     
    });
  }

}
