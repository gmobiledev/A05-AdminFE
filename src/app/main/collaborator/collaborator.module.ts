import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListCollaboratorComponent } from './list-collaborator/list-collaborator.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { SharedModule } from '../shared/share.module';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  {
    path: '',
    component: ListCollaboratorComponent
  }
]

@NgModule({
  declarations: [
    ListCollaboratorComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    CoreCommonModule,
    ContentHeaderModule,
    NgxDatatableModule,
    BlockUIModule.forRoot(), 
    NgxDatatableModule,
    BlockUIModule.forRoot(),
    NgSelectModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: []
})
export class CollaboratorModule { }
