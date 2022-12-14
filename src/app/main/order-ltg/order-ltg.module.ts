import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListOrderComponent } from './list-order/list-order.component';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { ViewOrderLtgComponent } from './view-order-ltg/view-order-ltg.component';
import { CreateOrderLtgComponent } from './create-order-ltg/create-order-ltg.component';

const routes: Routes = [
  {
    path: '',
    component: ListOrderComponent
  },
  {
    path: 'view/:id',
    component: ViewOrderLtgComponent
  },
  {  path: 'create',
    component: CreateOrderLtgComponent
  },
];

@NgModule({
  declarations: [
    ListOrderComponent,
    ViewOrderLtgComponent,
    CreateOrderLtgComponent
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
export class OrderLtgModule { }
