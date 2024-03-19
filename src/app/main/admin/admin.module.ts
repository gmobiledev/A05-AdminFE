import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxMaskModule } from 'ngx-mask';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ListAdminComponent } from './list-admin/list-admin.component';
import { ViewAdminComponent } from './view-admin/view-admin.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { BlockUIModule } from 'ng-block-ui';
import { CreateInventoryManagerComponent } from './create-inventory-manager/create-inventory-manager.component';


// routing
const routes: Routes = [
  {
    path: 'list',
    component: ListAdminComponent
  },
  {
    path: 'view/:id',
    component: CreateAdminComponent
  },
  {
    path: 'create',
    component: CreateAdminComponent
  },
  {
    path: 'create-inventory-manager',
    component: CreateInventoryManagerComponent
  },
];

@NgModule({
  declarations: [
    ListAdminComponent,
    ViewAdminComponent,
    CreateAdminComponent,
    CreateInventoryManagerComponent,
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
    NgxMaskModule.forRoot(),
    BlockUIModule.forRoot()
  ],
  providers: []
})
export class AdminModule {}
