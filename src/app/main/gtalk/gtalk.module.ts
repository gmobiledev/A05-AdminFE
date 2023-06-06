import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GTaskComponent } from './g-task/g-task.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { GTaskItemComponent } from './g-task-item/g-task-item.component';
import { GMsisdnComponent } from './g-msisdn/g-msisdn.component';
import { GCustomerComponent } from './g-customer/g-customer.component';
import { SharedModule } from '../shared/share.module';
import { ThongTinThueBaoComponent } from '../shared/thong-tin-thue-bao/thong-tin-thue-bao.component';
import { GReportComponent } from './g-report/g-report.component';

const routes: Routes = [
  {
    path: 'task',
    component: GTaskComponent
  },
  {
    path: 'msisdn',
    component: GMsisdnComponent
  },
  {
    path: 'customer',
    component: GCustomerComponent
  },
  {
    path: 'report',
    component: GReportComponent
  },
  
];

@NgModule({
  declarations: [
    GTaskComponent,
    GTaskItemComponent,
    GMsisdnComponent,
    GCustomerComponent,
    GReportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    NgbModule, 
    SharedModule,
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ]
})
export class GtalkModule { }
