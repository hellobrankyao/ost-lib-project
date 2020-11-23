import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UploaderComponent } from '../public-api';
import { OstProgressComponent } from './ost-progress/ost-progress.component';

const UPLOADER = [UploaderComponent, OstProgressComponent];

@NgModule({
  declarations: [...UPLOADER],
  imports: [
    CommonModule,
  ],
  exports: [...UPLOADER]
})
export class OstUtilsModule { }
