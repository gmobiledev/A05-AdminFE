import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchComponent } from './batch/batch.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
  }
];

@NgModule({
  declarations: [
    BatchComponent,
    BatchSimComponent,
    BatchGtalkComponent,
    ChannelComponent,
    ListBatchSimComponent
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
    NgxDaterangepickerMd.forRoot()
  ]
})
export class InventoryModule { }
