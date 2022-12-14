import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { CoreCommonModule } from '@core/common.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';



// routing
const routes: Routes = [
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
];

@NgModule({
  declarations: [
    ChangePasswordComponent
  ],
  imports: [CommonModule, RouterModule.forChild(routes), NgbModule, FormsModule, ReactiveFormsModule, CoreCommonModule, ContentHeaderModule]
})
export class ProfileModule {}
