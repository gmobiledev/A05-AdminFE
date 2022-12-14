import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreCommonModule } from '@core/common.module';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ViewRoleComponent } from './view-role/view-role.component';
import { ListRoleComponent } from './list-role/list-role.component';
import { BlockUIModule } from 'ng-block-ui';

// routing
const routes: Routes = [
  {
    path: 'list',
    component: ListRoleComponent
  },
  {
    path: 'view/:id',
    component: ViewRoleComponent
  },
];

@NgModule({
  declarations: [
    ViewRoleComponent,
    ListRoleComponent
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
    BlockUIModule.forRoot()
  ],
  providers: []
})
export class RoleModule {}
