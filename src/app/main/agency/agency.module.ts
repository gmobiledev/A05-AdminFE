import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListAgencyComponent } from './list-agency/list-agency.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxMaskModule } from 'ngx-mask';
import { CodeInputModule } from 'angular-code-input';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { CoreCommonModule } from '@core/common.module';
import { NgChartsModule } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const routes: Routes = [
  {
    path: 'list',
    component: ListAgencyComponent
  },
];

@NgModule({
  declarations: [
    ListAgencyComponent
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
  ]
})
export class AgencyModule { }
