import { NgModule } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ViewFileContractComponent } from '../shared/view-file-contract/view-file-contract.component';
import { PoupViewImageComponent } from './poup-view-image/poup-view-image.component';
import { ThongTinThueBaoComponent } from './thong-tin-thue-bao/thong-tin-thue-bao.component';
import { FormPersonalComponent } from './form-personal/form-personal.component';
import { FormOrganirationComponent } from './form-organiration/form-organiration.component';
import { OrganizationDocComponent } from './organization-doc/organization-doc.component';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';


const routes: Routes = [
  {
    path: 'person',
    component: FormPersonalComponent
  },
  {
    path: 'organiration',
    component: FormOrganirationComponent
  },
]

@NgModule({
  declarations: [
    ViewFileContractComponent,
    PoupViewImageComponent,    
    ThongTinThueBaoComponent, FormPersonalComponent, FormOrganirationComponent, OrganizationDocComponent
  ],
  imports: [
    CoreCommonModule,
    RouterModule.forChild(routes),
    NgbModule,
    FormsModule,
    NgxMaskModule.forRoot(),

  ],
  exports: [
    ViewFileContractComponent,
    PoupViewImageComponent,
    ThongTinThueBaoComponent,
    FormPersonalComponent, FormOrganirationComponent,
    OrganizationDocComponent
  ]
})
export class SharedModule { }
