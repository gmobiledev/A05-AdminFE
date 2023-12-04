import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxMaskModule } from 'ngx-mask';
import { NgbDateParserFormatter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { CodeInputModule } from 'angular-code-input';
import { CallHistoryComponent } from './call-history/call-history.component';
import { ManageListComponent } from './manage-list/manage-list.component';
import { ConfigurationInfoComponent } from './configuration-info/configuration-info.component';

const routes: Routes = [

  {
    path: 'call-history',
    component: CallHistoryComponent
  },
  {
    path: 'list',
    component: ManageListComponent
  },


];


@NgModule({
  declarations: [
    CallHistoryComponent,
    ManageListComponent,
    ConfigurationInfoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule,
    ReactiveFormsModule,
    CoreCommonModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
    ContentHeaderModule,
    CodeInputModule,
    NgxMaskModule.forRoot(),
  ]
})
export class GIPModule { }
