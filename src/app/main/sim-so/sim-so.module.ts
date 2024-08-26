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
import { SearchSimSoComponent } from './search-sim-so/search-sim-so.component';
import { ActionLogsComponent } from './action-logs/action-logs.component';
import { SellChannelComponent } from './sell-channel/sell-channel.component';
import { MsisdnComponent } from './msisdn/msisdn.component';
import { Client2gComponent } from './client2g/client2g.component';
import { ThongTinThueBaoComponent } from '../shared/thong-tin-thue-bao/thong-tin-thue-bao.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ApproveConvert2gItemComponent } from './approve-convert2g-item/approve-convert2g-item.component';
import { ApproveConvert2gIdentificationComponent } from './approve-convert2g-identification/approve-convert2g-identification.component';
import { ViewTaskOrganizationComponent } from './view-task-organization/view-task-organization.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ShipInfoComponent } from './ship-info/ship-info.component';
import { SearchSubscriptionComponent } from './search-subscription/search-subscription.component';
import { TaskAttachmentsComponent } from './task-attachments/task-attachments.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { TopupComponent } from './history/topup/topup.component';
import { BalanceChangesComponent } from './history/balance-changes/balance-changes.component';
import { MsisdnComponent as TTTBMsisdnComponent } from './history/msisdn/msisdn.component';
import { CommitmentComponent } from './commitment/commitment.component';
import { CommitmentDetailComponent } from './commitment-detail/commitment-detail.component';
import { WarningComponent } from './warning/warning.component';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { DvkhSearchComponent } from './dvkh-search/dvkh-search.component';
import { NgxMaskModule } from 'ngx-mask';
import { SearchEsimComponent } from './search-esim/search-esim.component';
import { WayLockComponent } from './way-lock/way-lock.component';
import { SearchDetailSubscriptionComponent } from './search-detail-subscription/search-detail-subscription.component';
import { PackageComponent } from './package/package.component';
import { TransHistoryComponent } from './trans-history/trans-history.component';
import { InfoESimComponent } from './info-e-sim/info-e-sim.component';
import { HistoryTopupComponent } from './history-topup/history-topup.component';

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
    component: ViewTaskOrganizationComponent
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
    path: 'dvkh-search',
    component: DvkhSearchComponent
  },
  {
    path: 'way-lock',
    component: WayLockComponent
  },
  {
    path: 'trans-history',
    component: TransHistoryComponent
  },
  {
    path: 'esim-search',
    component: SearchEsimComponent
  },
  {
    path: 'select-package',
    component: PackageComponent
  },
  {
    path: 'search-tttb',
    component: SearchDetailSubscriptionComponent
  },
  {
    path: 'history-topup',
    component: HistoryTopupComponent
  },
  {
    path: 'info-eSim',
    component: InfoESimComponent
  },
  {
    path: 'search-subscription',
    component: SearchSubscriptionComponent
  },
  {
    path: 'action-logs',
    component: ActionLogsComponent
  },
  {
    path: 'commitment',
    component: CommitmentComponent
  },
  {
    path: 'warning',
    component: WarningComponent
  },
  {
    path: 'commitment-detail',
    component: CommitmentDetailComponent
  },
  {
    path: 'sell-channel',
    component: SellChannelComponent
  },
  {
    path: 'msisdn',
    component: ListSimComponent
  },
  {
    path: 'client2g',
    component: Client2gComponent
  },
  {
    path: 'msisdn/topup',
    component: TopupComponent
  },
  {
    path: 'msisdn/balance-changes',
    component: BalanceChangesComponent
  },
  {
    path: 'msisdn/TTTB',
    component: TTTBMsisdnComponent
  },
];

@NgModule({
  declarations: [
    ListSimComponent,
    ListTaskComponent,
    TaskItemComponent,
    TaskCountdownComponent,
    SimPackagesComponent,
    SearchSimSoComponent,
    ActionLogsComponent,
    SellChannelComponent,
    MsisdnComponent,
    Client2gComponent,
    ApproveConvert2gItemComponent,
    ApproveConvert2gIdentificationComponent,
    ViewTaskOrganizationComponent,
    ShipInfoComponent,
    SearchSubscriptionComponent,
    TaskAttachmentsComponent,
    UploadFileComponent,
    TopupComponent,
    BalanceChangesComponent,
    TTTBMsisdnComponent,
    CommitmentComponent,
    CommitmentDetailComponent,
    WarningComponent,
    DvkhSearchComponent,
    SearchEsimComponent,
    WayLockComponent,
    SearchDetailSubscriptionComponent,
    PackageComponent,
    TransHistoryComponent,
    InfoESimComponent,
    HistoryTopupComponent,
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
    PdfViewerModule,
    QRCodeModule,
    Ng2FlatpickrModule,
    NgxMaskModule
  ]
})
export class SimSoModule { }
