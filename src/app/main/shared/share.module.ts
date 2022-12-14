import { NgModule } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { ViewFileContractComponent } from '../shared/view-file-contract/view-file-contract.component';
import { PoupViewImageComponent } from './poup-view-image/poup-view-image.component';


@NgModule({
  declarations: [
    ViewFileContractComponent,
    PoupViewImageComponent,    
  ],
  imports: [
    CoreCommonModule
  ],
  exports: [
    ViewFileContractComponent,
    PoupViewImageComponent
  ]
})
export class SharedModule { }
