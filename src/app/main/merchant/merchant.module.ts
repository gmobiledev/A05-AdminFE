import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMerchantComponent } from './list-merchant/list-merchant.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { InputMaskModule } from '../forms/form-elements/input-mask/input-mask.module';
import { NgxMaskModule } from 'ngx-mask';

const routes: Routes = [
  {
    path: 'list',
    component: ListMerchantComponent
  },
];

@NgModule({
  declarations: [
    ListMerchantComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    NgxDatatableModule,
    NgxMaskModule.forRoot(),
    BlockUIModule.forRoot()
  ],
  providers: []
})
export class MerchantModule { }
