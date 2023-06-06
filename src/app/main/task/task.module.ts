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
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ],
  providers: []
})
export class TaskModule { }
