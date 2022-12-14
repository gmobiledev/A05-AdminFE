import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeopleComponent } from './people/people.component';
import { ViewPeopleComponent } from './view-people/view-people.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { BlockUIModule } from 'ng-block-ui';
import { ListEkycBatchComponent } from './list-ekyc-batch/list-ekyc-batch.component';

const routes: Routes = [
  {
    path: '',
    component: PeopleComponent
  },
  {
    path: 'list-ekyc-batch',
    component: ListEkycBatchComponent
  },
];

@NgModule({
  declarations: [
    PeopleComponent,
    ViewPeopleComponent,
    ListEkycBatchComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    BlockUIModule.forRoot()
  ]
})
export class PeopleModule { }
