import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SweetAlertService {
  /**
   *
   */
  constructor(
    
  ) {}

  showConfirm(title) {
    return Swal.fire({
        title: title,        
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
      })
  }

  showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: message,
        timer: 3500,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  showError(message) {
    Swal.fire({
        icon: 'warning',
        title: 'Lỗi!',
        text: message,
        timer: 3500,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  showMess(message) {
    Swal.fire({
        icon: 'info',
        title: '',
        text: message,
        timer: 3500,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  showSuccessToast(message) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    })
    
    Toast.fire({
      icon: 'success',
      title: message
    })
  }
  
}
