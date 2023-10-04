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
import { AirtimeTopupComponent } from '../user/airtime-topup/airtime-topup.component';
import { ListUserComponent } from '../user/list-user/list-user.component';
import { ViewUserComponent } from '../user/view-user/view-user.component';
import { SharedModule } from '../shared/share.module';
import { ViewCustomerComponent } from './view-customer/view-customer.component';

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
    path: 'view',
    component: ViewCustomerComponent
  },
  
]

@NgModule({
  declarations: [
    ListCustomerComponent,
    CreateCustomerComponent,
    ViewCustomerComponent
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
