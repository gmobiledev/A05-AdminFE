import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListLoanBankComponent } from './list-loan-bank/list-loan-bank.component';
import { ViewLoanBankComponent } from './view-loan-bank/view-loan-bank.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { SharedModule } from '../shared/share.module';



const routes: Routes = [
  {
    path: '',
    component: ListLoanBankComponent
  },
  {
    path: 'view/:id',
    component: ViewLoanBankComponent
  },
];

@NgModule({
  declarations: [
    ListLoanBankComponent,
    ViewLoanBankComponent,    
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
export class LoanBankModule { }
