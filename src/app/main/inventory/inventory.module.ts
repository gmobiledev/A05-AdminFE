import { NgModule, CUSTOM_ELEMENTS_SCHEMA , NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchComponent } from './batch/batch.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BatchSimComponent } from './batch-sim/batch-sim.component';
import { BatchGtalkComponent } from './batch-gtalk/batch-gtalk.component';
import { ChannelComponent } from './channel/channel.component';
import { ListBatchSimComponent } from './list-batch-sim/list-batch-sim.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NewBatchExportComponent } from './new-batch-export/new-batch-export.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: 'batch',
    component: BatchComponent
  },
  {
    path: 'batch-sim',
    component: BatchSimComponent
  },
  {
    path: 'channel',
    component: ChannelComponent
  },
  {
    path: 'list-batch',
    component: ListBatchSimComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'new-batch-export',
    component: NewBatchExportComponent
  }
];

@NgModule({
  declarations: [
    BatchComponent,
    BatchSimComponent,
    BatchGtalkComponent,
    ChannelComponent,
    ListBatchSimComponent,
    DashboardComponent,
    NewBatchExportComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    BlockUIModule.forRoot(),
    PdfViewerModule,
    HighchartsChartModule,
    NgbAccordionModule,
    NgxDaterangepickerMd.forRoot(),
    NgxDatatableModule,
    NgSelectModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
  ]
})
export class InventoryModule { }
