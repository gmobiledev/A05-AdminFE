import { NgModule } from '@angular/core';

import { FilterPipe } from '@core/pipes/filter.pipe';

import { InitialsPipe } from '@core/pipes/initials.pipe';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';
import { ShowStatusPipe } from '@core/pipes/show-status.pipe';
import { ShowStatusBatchPipe } from '@core/pipes/show-statusBatch.pipe';

import { FormatDatePipe } from './formatDate.pipe';
import { StatusFile } from './statusFile.pipe';
import { ShowStatusLoanPipe } from './show-status-loan.pipe';
import { ShowStatusTelecomPipe } from './show-status-telecom.pipe';
import { ShowIconMnoPipe } from './show-icon-mno.pipe';
import { ShowStatusEkycPipe } from './show-status-ekyc.pipe';
import { ShowStatusSimPipe } from './show-status-Sim';
import { ShowStatusMsisdnPipe } from './show-status-msisdn.pipe';
import { ShowStatusTaskPipe } from './show-status-task.pipe';
import { NumberToTextPipe } from './numberToText.pipe';
import { FormatPricePipe } from './formatPrice.pipe';
import { ShowStatusTelecomGsimPipe } from './show-status-telecom-gsim.pipe';
import { TypeBalanceChangesPipe } from './type-balance-changes.pipe';
import { TypeBatchFormPipe } from './type-batch-form.pipe';
import { ShowStatusSellPipe } from './show-status-sell.pipe';
import { ShowStatusProductPipe } from './show-status-product';
import { ShowStatusProductStorePipe } from './show-status-product-store.pipe';
import { ShowTransPipe } from './show-type-trans.pipe';
import { ShowStatusTransPipe } from './show-status-trans.pipe';
import { ShowStatusUpdatePricePipe } from './show-status-update-price.pipe';

@NgModule({
  declarations: [ShowStatusSimPipe,InitialsPipe, ShowStatusEkycPipe, FilterPipe, StripHtmlPipe, 
    SafePipe, ShowStatusPipe, ShowStatusTelecomPipe, ShowIconMnoPipe, FormatDatePipe, StatusFile, ShowStatusLoanPipe,
    ShowStatusMsisdnPipe, ShowStatusTaskPipe, NumberToTextPipe, FormatPricePipe, ShowStatusTelecomGsimPipe,ShowStatusBatchPipe,
    TypeBalanceChangesPipe, TypeBatchFormPipe,
    ShowStatusSellPipe,
    ShowStatusUpdatePricePipe,
    ShowStatusProductPipe,
    ShowStatusProductStorePipe, ShowTransPipe, ShowStatusTransPipe
  ],
  imports: [],
  exports: [ShowStatusSimPipe,InitialsPipe, ShowStatusEkycPipe, FilterPipe, StripHtmlPipe, 
    SafePipe, ShowStatusPipe, ShowStatusTelecomPipe,ShowIconMnoPipe, FormatDatePipe, StatusFile, ShowStatusLoanPipe,
    ShowStatusMsisdnPipe, ShowStatusTaskPipe, NumberToTextPipe, FormatPricePipe, ShowStatusTelecomGsimPipe, ShowStatusBatchPipe,
    TypeBalanceChangesPipe, TypeBatchFormPipe,
    ShowStatusSellPipe,
    ShowStatusUpdatePricePipe,
    ShowStatusProductPipe,
    ShowStatusProductStorePipe,ShowTransPipe, ShowStatusTransPipe
  ]
})
export class CorePipesModule {}
