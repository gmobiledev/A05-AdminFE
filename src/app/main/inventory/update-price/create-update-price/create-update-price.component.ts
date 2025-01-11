import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-update-price',
  templateUrl: './create-update-price.component.html',
  styleUrls: ['./create-update-price.component.scss']
})
export class CreateUpdatePriceComponent implements OnInit {
  public selectedFiles: File[] = [];
  public submitted: boolean = false;
  public form: FormGroup;
    
  constructor() { }

  ngOnInit(): void {
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files[0] && input.files[0].size > 0) {
      let file = input.files[0];
      this.selectedFiles.push(file);
      console.log(this.selectedFiles);
    }
  }

  get f() {
    return this.form.controls;
  }

  onSubmitCreate(){
    
  }

}
