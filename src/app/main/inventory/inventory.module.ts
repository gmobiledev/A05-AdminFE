import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchComponent } from './batch/batch.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { BatchSimComponent } from './batch-sim/batch-sim.component';
import { BatchGtalkComponent } from './batch-gtalk/batch-gtalk.component';
import { ChannelComponent } from './channel/channel.component';
import { ListBatchSimComponent } from './list-batch-sim/list-batch-sim.component';
import { SellChanelComponent } from './sell-chanel/sell-chanel.component';
import { NewSellChanelComponent } from './new-sell-chanel/new-sell-chanel.component';
import { EditSellChanelComponent } from './edit-sell-chanel/edit-sell-chanel.component';

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
    path: 'sell-chanel',
    component: SellChanelComponent
  },
  {
    path: 'new-sell-chanel',
    component: NewSellChanelComponent
  },
  {
    path: 'edit-sell-chanel',
    component: EditSellChanelComponent
  }
];

@NgModule({
  declarations: [
    BatchComponent,
    BatchSimComponent,
    BatchGtalkComponent,
    ChannelComponent,
    ListBatchSimComponent,
    SellChanelComponent,
    NewSellChanelComponent,
    EditSellChanelComponent
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
export class InventoryModule { }
