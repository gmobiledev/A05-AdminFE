import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryS99Component } from './summary-s99/summary-s99.component';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';


// routing
const routes: Routes = [
  {
    path: 'report/summary-s99',
    component: SummaryS99Component
  },
];

@NgModule({
  declarations: [SummaryS99Component],
  imports: [CommonModule, RouterModule.forChild(routes), CoreCommonModule, NgApexchartsModule, Ng2FlatpickrModule]
})
export class ReportModule {}