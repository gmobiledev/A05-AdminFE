import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SharedModule } from '../shared/share.module';
import { ListTaskComponent } from './list-task/list-task.component';



const routes: Routes = [
  {
    path: '',
    component: ListTaskComponent
  },
];

@NgModule({
  declarations: [
    ListTaskComponent,  
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(routes), 
    NgbModule, 
    FormsModule, 
    ReactiveFormsModule, 
    CoreCommonModule, 
    ContentHeaderModule,
    SharedModule
  ]
})
export class TaskModule { }
