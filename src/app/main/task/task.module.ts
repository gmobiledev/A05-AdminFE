import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SharedModule } from '../shared/share.module';
import { ListTaskComponent } from './list-task/list-task.component';
import { ReportComponent } from './report/report.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ServiceCode } from 'app/utils/constants';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'report',
    component: ReportComponent,
  },
  {
    path: 'list',
    component: ListTaskComponent,
  },
  {
    path: 'sim-profile',
    data: {
      service: ServiceCode.SIM_PROFILE,
      single_service: 1
    },
    component: ListTaskComponent,
  },
  {
    path: 'sim-kitting',
    data: {
      service: ServiceCode.SIM_KITTING,
      single_service: 1
    },
    component: ListTaskComponent,
  },
  {
    path: 'sim-register',
    data: {
      service: ServiceCode.SIM_REGISTER,
      single_service: 1
    },
    component: ListTaskComponent,
  },
  {
    path: 'balance',
    data: {
      service: ServiceCode.ADD_MONEY_BALANCE,
      single_service: 1
    },
    component: ListTaskComponent,
  },
  {
    path: 'data',
    data: {
      service: ServiceCode.ADD_DATA_BALANCE,
      single_service: 1
    },
    component: ListTaskComponent,
  },
  {
    path: 'topup',
    data: {
      service: ServiceCode.TELECOM_TOPUP,
      single_service: 1
    },
    component: ListTaskComponent,
  },
];

@NgModule({
  declarations: [
    ListTaskComponent,
    ReportComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    ContentHeaderModule,
    SharedModule,
    NgApexchartsModule,
    NgxDatatableModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  providers: []
})
export class TaskModule { }
