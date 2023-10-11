import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCustomerComponent } from './list-customer/list-customer.component';
import { CreateCustomerComponent } from './create-customer/create-customer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedModule } from '../shared/share.module';

const routes: Routes = [
  {
    path: 'list',
    component: ListCustomerComponent
  },
  {
    path: 'create',
    component: CreateCustomerComponent
  },
  {
    path: 'update/:id',
    component: CreateCustomerComponent
  },

  
]

@NgModule({
  declarations: [
    ListCustomerComponent,
    CreateCustomerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgxDatatableModule,
    BlockUIModule.forRoot(), 
    NgxDatatableModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  providers: []
})
export class CustomerModule { }
