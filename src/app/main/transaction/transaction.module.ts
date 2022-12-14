import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListTransactionComponent } from './list-transaction/list-transaction.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  {
    path: '',
    component: ListTransactionComponent
  },
];

@NgModule({
  declarations: [
    ListTransactionComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    NgxDatatableModule,
    BlockUIModule.forRoot(),
    NgxDaterangepickerMd.forRoot()
  ]
})
export class TransactionModule { }
