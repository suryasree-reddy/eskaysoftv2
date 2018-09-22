import { MasterRouter } from './master.router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscheduleComponent } from './subschedule/subschedule.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AgGridModule } from 'ag-grid-angular';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { MasterService } from './master.service';

@NgModule({
  imports: [
    CommonModule,
    MasterRouter,
    ReactiveFormsModule,
    TypeaheadModule,
    AgGridModule,
    BsDropdownModule,
    FormsModule,
    ModalModule,
    HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ],
  providers: [NgForm,
    NgModel,
    FormsModule,
    MasterService
  ],
  declarations: [ScheduleComponent, SubscheduleComponent]
})
export class MasterModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
