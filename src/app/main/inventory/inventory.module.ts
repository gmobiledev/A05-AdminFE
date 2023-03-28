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
    path: 'batch-gtalk',
    component: BatchGtalkComponent
  }
];

@NgModule({
  declarations: [
    BatchComponent,
    BatchSimComponent,
    BatchGtalkComponent
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
    NgxDaterangepickerMd.forRoot()
  ]
})
export class InventoryModule { }
