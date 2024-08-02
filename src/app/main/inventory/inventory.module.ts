import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchComponent } from './batch/batch.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbAccordionModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BatchSimComponent } from './batch-sim/batch-sim.component';
import { BatchGtalkComponent } from './batch-gtalk/batch-gtalk.component';
import { ChannelComponent } from './channel/channel.component';
import { ListBatchSimComponent } from './list-batch-sim/list-batch-sim.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NewBatchExportComponent } from './new-batch-export/new-batch-export.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { SellChanelComponent } from './sell-chanel/sell-chanel.component';
import { NewSellChanelComponent } from './new-sell-chanel/new-sell-chanel.component';
import { EditSellChanelComponent } from './edit-sell-chanel/edit-sell-chanel.component';
import { ViewSellChanelComponent } from './view-sell-chanel/view-sell-chanel.component';
import { ViewBatchExportComponent } from './view-batch-export/view-batch-export.component';
import { CodeInputModule } from 'angular-code-input';
import { BatchType } from 'app/utils/constants';
import { ListBatchProductsComponent } from './list-batch-products/list-batch-products.component';
import { ViewDetailTotalSellComponent } from './view-detail-total-sell/view-detail-total-sell.component';
import { KinhDoanhComponent } from './reports/kinh-doanh/kinh-doanh.component';
import { DoanhThuComponent } from './reports/doanh-thu/doanh-thu.component';
import { NgxMaskModule } from 'ngx-mask';
import { ViewJuniorSellComponent } from './view-junior-sell/view-junior-sell.component';
import { ViewDetailNomarlSellComponent } from './view-detail-nomarl-sell/view-detail-nomarl-sell.component';
import { CsvModule } from '@ctrl/ngx-csv';
import { EditProductsComponent } from './edit-products/edit-products.component';
import { TonKhoComponent } from './reports/ton-kho/ton-kho.component';
import { TonKhoSimComponent } from './reports/ton-kho-sim/ton-kho-sim.component';
import { TongHopComponent } from './reports/tong-hop/tong-hop.component';
import { ChiTietComponent } from './reports/chi-tiet/chi-tiet.component';
import { KetQuaComponent } from './reports/ket-qua/ket-qua.component';
import { ActionLogsComponent } from './action-logs/action-logs.component';
import { SearchProductsTransferComponent } from './search-products-transfer/search-products-transfer.component';
import { ChiTietG59Component } from './report-g59/chi-tiet-g59/chi-tiet-g59.component';
import { TongHopG59Component } from './report-g59/tong-hop-g59/tong-hop-g59.component';
import { DoanhThuG59Component } from './report-g59/doanh-thu-g59/doanh-thu-g59.component';
import { KetQuaG59Component } from './report-g59/ket-qua-g59/ket-qua-g59.component';
import { KinhDoanhG59Component } from './report-g59/kinh-doanh-g59/kinh-doanh-g59.component';
import { TonKhoG59Component } from './report-g59/ton-kho-g59/ton-kho-g59.component';
import { TonKhoSimG59Component } from './report-g59/ton-kho-sim-g59/ton-kho-sim-g59.component';

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
    path: 'channel',
    component: ChannelComponent
  },
  {
    path: 'list-batch',
    component: ListBatchSimComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'new-batch-export',
    component: NewBatchExportComponent
  },
  {
    path: 'sell-chanel',
    component: SellChanelComponent
  },
  {
    path: 'new-sell-chanel',
    component: NewSellChanelComponent
  },
  {
    path: 'edit-sell-chanel/:id',
    component: EditSellChanelComponent
  },
  {
    path: 'view-sell-chanel',
    component: ViewSellChanelComponent
  },
  {
    path: 'batch-export/:id',
    component: ViewBatchExportComponent
  },
  {
    path: 'batch/retrieve',
    data: {
      type: BatchType.RETRIEVE
    },
    component: NewBatchExportComponent
  },
  {
    path: 'list-batch-products',
    component: ListBatchProductsComponent
  },

  {
    path: 'view-detail-totalSell',
    component: ViewDetailTotalSellComponent
  },
  {
    path: 'report/doanh-thu',
    component: DoanhThuComponent
  },
  {
    path: 'report/kinh-doanh',
    component: KinhDoanhComponent
  },
  {
    path: 'report/ton-kho',
    component: TonKhoComponent
  },

  {
    path: 'report/ton-kho-sim',
    component: TonKhoSimComponent
  },
  {
    path: 'report/tong-hop',
    component: TongHopComponent
  },

  {
    path: 'report/chi-tiet',
    component: ChiTietComponent
  },

  {
    path: 'report/ket-qua',
    component: KetQuaComponent
  },

  {
    path: 'view-junior-sell',
    component: ViewJuniorSellComponent
  },

  {
    path: 'view-detail-nomarlSell',
    component: ViewDetailNomarlSellComponent
  },
  {
    path: 'edit-products',
    component: EditProductsComponent
  },
  {
    path: 'action-logs',
    component: ActionLogsComponent
  },
  {
    path: 'search-product-transfer',
    component: SearchProductsTransferComponent
  },
];

@NgModule({
  declarations: [
    BatchComponent,
    BatchSimComponent,
    BatchGtalkComponent,
    ChannelComponent,
    ListBatchSimComponent,
    DashboardComponent,
    NewBatchExportComponent,
    SellChanelComponent,
    NewSellChanelComponent,
    EditSellChanelComponent,
    ViewSellChanelComponent,
    ViewBatchExportComponent,
    ListBatchProductsComponent,
    ViewDetailTotalSellComponent,
    KinhDoanhComponent,
    DoanhThuComponent,
    ViewJuniorSellComponent,
    ViewDetailNomarlSellComponent,
    EditProductsComponent,
    TonKhoComponent,
    TonKhoSimComponent, 
    TongHopComponent,
    ChiTietComponent, 
    KetQuaComponent, ActionLogsComponent, SearchProductsTransferComponent, ChiTietG59Component, TongHopG59Component, DoanhThuG59Component, KetQuaG59Component, KinhDoanhG59Component, TonKhoG59Component, TonKhoSimG59Component,
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
    PdfViewerModule,
    HighchartsChartModule,
    NgbAccordionModule,
    NgxDaterangepickerMd.forRoot(),
    NgxDatatableModule,
    NgSelectModule,
    CodeInputModule,
    NgxMaskModule.forRoot(),
    CsvModule,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
  ]
})
export class InventoryModule { }
