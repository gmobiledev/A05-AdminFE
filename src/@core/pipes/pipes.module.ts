import { NgModule } from '@angular/core';

import { FilterPipe } from '@core/pipes/filter.pipe';

import { InitialsPipe } from '@core/pipes/initials.pipe';

import { SafePipe } from '@core/pipes/safe.pipe';
import { StripHtmlPipe } from '@core/pipes/stripHtml.pipe';
import { ShowStatusPipe } from '@core/pipes/show-status.pipe';
import { FormatDatePipe } from './formatDate.pipe';
import { StatusFile } from './statusFile.pipe';
import { ShowStatusLoanPipe } from './show-status-loan.pipe';
import { ShowStatusTelecomPipe } from './show-status-telecom.pipe';
import { ShowIconMnoPipe } from './show-icon-mno.pipe';
import { ShowStatusEkycPipe } from './show-status-ekyc.pipe';

@NgModule({
  declarations: [InitialsPipe, ShowStatusEkycPipe, FilterPipe, StripHtmlPipe, SafePipe, ShowStatusPipe, ShowStatusTelecomPipe, ShowIconMnoPipe, FormatDatePipe, StatusFile, ShowStatusLoanPipe],
  imports: [],
  exports: [InitialsPipe, ShowStatusEkycPipe, FilterPipe, StripHtmlPipe, SafePipe, ShowStatusPipe, ShowStatusTelecomPipe,ShowIconMnoPipe, FormatDatePipe, StatusFile, ShowStatusLoanPipe]
})
export class CorePipesModule {}
