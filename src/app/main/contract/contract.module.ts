import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractComponent } from './contract.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreCommonModule } from '@core/common.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ViewContractComponent } from './view-contract/view-contract.component';
import { ViewFileContractComponent } from '../shared/view-file-contract/view-file-contract.component';
import { SharedModule } from '../shared/share.module';


const routes: Routes = [
  {
    path: '',
    component: ContractComponent
  },
  {
    path: 'view/:id',
    component: ViewContractComponent
  },
];

@NgModule({
  declarations: [
    ContractComponent,
    ViewContractComponent,    
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
export class ContractModule { }
