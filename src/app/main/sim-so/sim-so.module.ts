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
import { SearchSimSoComponent } from './search-sim-so/search-sim-so.component';
import { ActionLogsComponent } from './action-logs/action-logs.component';
import { SellChannelComponent } from './sell-channel/sell-channel.component';
import { MsisdnComponent } from './msisdn/msisdn.component';

const routes: Routes = [
  {
    path: '',
    component: ListTaskComponent
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
  {
    path: 'search',
    component: SearchSimSoComponent
  },
  {
    path: 'action-logs',
    component: ActionLogsComponent
  },
  {
    path: 'sell-channel',
    component: SellChannelComponent
  },
  {
    path: 'msisdn',
    component: ListSimComponent
  },
];

@NgModule({
  declarations: [
    ListSimComponent,
    ListTaskComponent,
    TaskItemComponent,
    TaskCountdownComponent,
    SimPackagesComponent,
    ViewTaskComponent,
    SearchSimSoComponent,
    ActionLogsComponent,
    SellChannelComponent,
    MsisdnComponent,
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
