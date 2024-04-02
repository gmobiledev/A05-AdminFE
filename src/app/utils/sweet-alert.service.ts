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

  showSuccess(message,timeout = 3500) {
    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: message,
        timer: timeout,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  /**
   * 
   * @param htmlMessage 
   * @param type success | warning | info
   */
  showHtml(htmlMessage, type, title) {
    Swal.fire({
      icon: type,
      title: title,
      html: htmlMessage,      
      customClass: {
        confirmButton: 'btn btn-success'
      }
  });
  }

  showError(message, timeout = 3500) {
    Swal.fire({
        icon: 'warning',
        title: 'Lỗi!',
        text: message,
        timer: timeout,
        customClass: {
          confirmButton: 'btn btn-success'
        }
    });
  }

  showMess(message, timeout = 3500) {
    Swal.fire({
        icon: 'info',
        title: '',
        text: message,
        timer: timeout,
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
