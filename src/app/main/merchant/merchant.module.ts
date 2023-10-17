import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListMerchantComponent } from './list-merchant/list-merchant.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { InputMaskModule } from '../forms/form-elements/input-mask/input-mask.module';
import { NgxMaskModule } from 'ngx-mask';
import { RootAccountComponent } from './root-account/root-account.component';
import { TasksRootAccountComponent } from './tasks-root-account/tasks-root-account.component';
import { NgChartsModule } from 'ng2-charts';
import { CodeInputModule } from 'angular-code-input';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PdfViewerModule } from 'ng2-pdf-viewer';


const routes: Routes = [
  {
    path: 'list',
    component: ListMerchantComponent
  },

  {
    path: 'root',
    component: RootAccountComponent
  },
  {
    path: 'root-payment',
    component: TasksRootAccountComponent
  },
];

@NgModule({
  declarations: [
    ListMerchantComponent,
    RootAccountComponent,
    TasksRootAccountComponent
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
    NgChartsModule,
    CodeInputModule,
    NgxMaskModule.forRoot(),
    BlockUIModule.forRoot(),
    NgApexchartsModule,
    PdfViewerModule,
    NgxDaterangepickerMd.forRoot()
  ],
  providers: []
})
export class MerchantModule { }
