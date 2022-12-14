import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAgentComponent } from './list-agent/list-agent.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  {
    path: '',
    component: ListAgentComponent
  },
];

@NgModule({
  declarations: [
    ListAgentComponent
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
export class AgentModule { }
