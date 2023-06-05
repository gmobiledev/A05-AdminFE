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
import { CardAnalyticsService } from 'app/main/ui/card/card-analytics/card-analytics.service';


const routes: Routes = [
  {
    path: '',
    component: ListTaskComponent
  },
  {
    path: 'report',
    component: ReportComponent,
    resolve: {
      css: CardAnalyticsService
    },
    data: { animation: 'analytics' }
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
    NgApexchartsModule
  ],
  providers: [CardAnalyticsService]
})
export class TaskModule { }
