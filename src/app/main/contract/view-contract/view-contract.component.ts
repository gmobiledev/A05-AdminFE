import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContractServive } from 'app/auth/service/contract.service';
import { FileServive } from 'app/auth/service/file.service';

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss']
})
export class ViewContractComponent implements OnInit {

  public id: any;
  public contract: any;
  public people: any;
  public files: any;
  public contentHeader: any =  {
    headerTitle: 'Xem hợp đồng',
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
          isLink: true,
          link: '/contract'
        },
        {
          name: 'Xem hợp đồng',
          isLink: false
        }
      ]
    }
  };

  constructor(
    private activedRoute: ActivatedRoute,
    private contractService: ContractServive,    
  ) { 
    this.id = this.activedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.contractService.getById(this.id).subscribe(res => {
      this.contract = res.data.contract;
      this.people = res.data.people;
      this.files = res.data.files;

    })
  }

}
