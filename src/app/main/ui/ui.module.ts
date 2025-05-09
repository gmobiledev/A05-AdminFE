import { NgModule } from '@angular/core';

// import { CardModule } from 'app/main/ui/card/card.module';
import { ColorsModule } from 'app/main/ui/colors/colors.module';
import { IconsModule } from 'app/main/ui/icons/icons.module';
import { TypographyModule } from 'app/main/ui/typography/typography.module';

@NgModule({
  imports: [ColorsModule, IconsModule, TypographyModule]
})
export class UIModule {}
