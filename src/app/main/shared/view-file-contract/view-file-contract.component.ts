import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'app/auth/service';
import { FileServive } from 'app/auth/service/file.service';

@Component({
  selector: 'app-view-file-contract',
  templateUrl: './view-file-contract.component.html',
  styleUrls: ['./view-file-contract.component.scss']
})
export class ViewFileContractComponent implements OnInit {

  @Input() id = '';
  public urlFile: any = "";
  public fileType: any;

  constructor(
    private fileService: FileServive,
    private userService: UserService
  ) {
    
   }

  ngOnInit(): void {
    console.log(this.id);
    this.viewFile(this.id)
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
        // var newBlob = new Blob([x.body], { type: x.body.type });
        // this.fileType = x.body.type;
        
        
        const byteArray = new Uint8Array(atob(res.data.base64).split('').map(char => char.charCodeAt(0)));
        const newBlob = new Blob([byteArray], {type: res.data.file_type});
        this.fileType = res.data.file_type;
        this.urlFile = URL.createObjectURL(newBlob);  
    });
  }

}
