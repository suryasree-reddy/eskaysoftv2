import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';


import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClientModule, HttpClient} from '@angular/common/http';

import { SynectiksCommonGridComponent } from 'src/app/commonComponents/synectiks-common-grid/synectiks-common-grid.component';
import { ErrormessagesComponent } from 'src/app/commonComponents/errormessages/errormessages.component';
import { ConfirmationModelDialogComponent } from 'src/app/commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';

@NgModule({
  imports: [
    CommonModule,
    AgGridModule,
    HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ],
  declarations: [SynectiksCommonGridComponent, ErrormessagesComponent, ButtonsComponent, ConfirmationModelDialogComponent],
  exports: [ SynectiksCommonGridComponent, ErrormessagesComponent, ButtonsComponent, ConfirmationModelDialogComponent ],
  entryComponents: [ ConfirmationModelDialogComponent ]
})
export class SharedmoduleModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
