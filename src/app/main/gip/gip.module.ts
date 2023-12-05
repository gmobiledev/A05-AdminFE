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
import { ListMerchantComponent } from './list-merchant-gip/list-merchant.component';
import { GipTaskComponent } from './gip-task/gip-task.component';

const routes: Routes = [

  {
    path: 'call-history',
    component: CallHistoryComponent
  },
  {
    path: 'list',
    component: ManageListComponent
  },
  {
    path: 'merchant',
    component: ListMerchantComponent
  },

  {
    path: 'task',
    component: GipTaskComponent
  },


];


@NgModule({
  declarations: [
    CallHistoryComponent,
    ManageListComponent,
    ListMerchantComponent,
    GipTaskComponent
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
