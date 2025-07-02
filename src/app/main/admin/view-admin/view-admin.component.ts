import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoleService } from 'app/auth/service/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-admin',
  templateUrl: './view-admin.component.html',
  styleUrls: ['./view-admin.component.scss']
})
export class ViewAdminComponent implements OnInit {
  public contentHeader: object;
  public listRoles: any;
  public listAllRole: any;
  public listAllRoleExcept: any;
  public selectedRoles: any;
  public id: any;

  constructor(
    private route: ActivatedRoute,
    private _roleService: RoleService
  ) { }

  getData(): void {
    this._roleService.getByUser(this.id).subscribe(res => {
      this.listRoles = res.data;
      var currentRoles = this.listRoles;
      this._roleService.getAll().subscribe(res => {
        this.listAllRole = res.data;
        this.listAllRoleExcept = this.listAllRole.filter(function(e) { 
          return !currentRoles.some(function(s) { 
              return (s.item_name === e.parent); 
          });
        });
      })
    });
    
  }

  onSubmitAdd(): void {
    console.log(this.selectedRoles);
    Swal.fire({
      title: 'Bạn có đồng ý thêm các quyền vào ' + this.id + ' ?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Submit',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: '',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    });
  }

  onSubmitRemove(): void {
    console.log(this.selectedRoles);
    Swal.fire({
      title: 'Bạn có đồng gỡ các quyền khỏi ' + this.id + ' ?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7367F0',
      cancelButtonColor: '#E42728',
      confirmButtonText: 'Submit',
      animation: true,
      showClass: { popup: 'animate__animated animate__flipInX' },
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger ml-1'
      }
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: '',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        });
      }
    });
  }

  ngOnInit(): void {
    this.contentHeader = {
      headerTitle: 'Chi tiết admin',
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
            name: 'Danh sách tài khoản',
            isLink: true,
            link: '/admin/list'
          },
          {
            name: 'Chi tiết admin',
            isLink: false
          }
        ]
      }
    };
    this.id = this.route.snapshot.paramMap.get('id');
    this.getData();
  }

}
