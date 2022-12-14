import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RoleService } from 'app/auth/service/role.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-role',
  templateUrl: './view-role.component.html',
  styleUrls: ['./view-role.component.scss']
})
export class ViewRoleComponent implements OnInit {
  public contentHeader: object;
  public id: any;
  public data: any;
  public allPermission: any;
  public allPermissionExcept: any;
  public selectedPermission: any;

  constructor(
    private _toastrService: ToastrService,
    private roleService: RoleService,
    private route: ActivatedRoute
  ) { }

  getData(): void {
    this.roleService.getPermissionRole(this.id).subscribe(res => {
      this.data = res.data;
      var currentPermission = this.data;
      this.roleService.getPermissionRole().subscribe(res => {
        this.allPermission = res.data;
        this.allPermissionExcept = this.allPermission.filter(function(e) { 
          return !currentPermission.some(function(s) { 
              return (s.child === e.child); 
          });
        });
      }, error => {
        console.log(error);
      })
      
    }, error => {
      console.log(error);
    });
    
  }

  onSubmitAdd(): void {
    var roleService = this.roleService;
    console.log(this.selectedPermission);
    const dataPost = this.selectedPermission.map(item => { return {'parent': this.id, 'child': item}});

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
        roleService.addRouteToRole(this.id, dataPost).subscribe(res => {
          if(res.status) {
            this._toastrService.success(
              'Cập nhật thành công',
              '',
              { toastClass: 'toast ngx-toastr', closeButton: true }
            );
            return;
          }
          this._toastrService.error(
            res.message,
            '',
            { toastClass: 'toast ngx-toastr', closeButton: true }
          );
        }, error => {
          console.log(error);
          this._toastrService.error(
            "Đã có lỗi xảy ra, vui lòng thử lại sau",
            '',
            { toastClass: 'toast ngx-toastr', closeButton: true }
          );
        })
      }
    });
  }

  onSubmitRemove(): void {
    var roleService = this.roleService;
    console.log(this.selectedPermission);
    const dataPost = this.selectedPermission.map(item => { return {'parent': this.id, 'child': item}});

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
        roleService.removeRouteFromRole(this.id, dataPost).subscribe(res => {
          if(res.status) {
            this._toastrService.success(
              'Cập nhật thành công',
              '',
              { toastClass: 'toast ngx-toastr', closeButton: true }
            );
            return;
          }
          this._toastrService.error(
            res.message,
            '',
            { toastClass: 'toast ngx-toastr', closeButton: true }
          );
        }, error => {
          console.log(error);
          this._toastrService.error(
            "Đã có lỗi xảy ra, vui lòng thử lại sau",
            '',
            { toastClass: 'toast ngx-toastr', closeButton: true }
          );
        })
      }
    });
  }

  ngOnInit(): void {
    
    this.id = this.route.snapshot.paramMap.get('id');
    this.contentHeader = {
      headerTitle: 'Vai trò ' + this.id,
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
            name: 'Phân quyền',
            isLink: true,
            link: '/role/list'
          },
          {
            name: this.id,
            isLink: false
          }
        ]
      }
    };
    this.getData();
    
  }
  

}
