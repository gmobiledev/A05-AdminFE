import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ListUserComponent } from './list-user/list-user.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { BlockUIModule } from 'ng-block-ui';
import { AirtimeTopupComponent } from './airtime-topup/airtime-topup.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';


// routing
const routes: Routes = [
  {
    path: 'list',
    component: ListUserComponent
  },
  {
    path: 'airtime',
    component: AirtimeTopupComponent
  },
  // {
  //   path: 'airtime-ketoan',
  //   component: AirtimeTopupComponent,
  //   data: {
  //     role: 'ketoan'
  //   }
  // },
  {
    path: ':id',
    component: ViewUserComponent
  }
];

@NgModule({
  declarations: [
    ListUserComponent,
    ViewUserComponent,
    AirtimeTopupComponent
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
    BlockUIModule.forRoot(), 
    NgxDatatableModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  providers: []
})
export class UserModule { }
