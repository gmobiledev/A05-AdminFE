import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListSimComponent } from './list-sim/list-sim.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ListTaskComponent } from './list-task/list-task.component';
import { TaskItemComponent } from './task-item/task-item.component';
import { TaskCountdownComponent } from './task-countdown/task-countdown.component';
import { SharedModule } from '../shared/share.module';
import { SimPackagesComponent } from './sim-packages/sim-packages.component';
import { QuillModule } from 'ngx-quill';
import { ViewTaskComponent } from './view-task/view-task.component';

const routes: Routes = [
  {
    path: '',
    component: ListSimComponent
  },
  {
    path: 'task',
    component: ListTaskComponent
  },
  {
    path: 'task/:id',
    component: ViewTaskComponent
  },
  {
    path: 'package',
    component: SimPackagesComponent
  },
];

@NgModule({
  declarations: [
    ListSimComponent,
    ListTaskComponent,
    TaskItemComponent,
    TaskCountdownComponent,
    SimPackagesComponent,
    ViewTaskComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    FormsModule,
    CoreCommonModule, 
    ContentHeaderModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    SharedModule,
    QuillModule.forRoot(),
  ]
})
export class SimSoModule { }
