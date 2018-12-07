import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';

import { GstReportsRoutingModule } from './gst-reports-routing.module';
import { GstRegistersComponent } from './gst-registers/gst-registers.component';
import { GstrOneComponent } from './gstr-one/gstr-one.component';
import { GstrTwoComponent } from './gstr-two/gstr-two.component';
import { GstrThreeComponent } from './gstr-three/gstr-three.component';
import { GstConsolidationsComponent } from './gst-consolidations/gst-consolidations.component';

@NgModule({
  imports: [
    CommonModule,
    GstReportsRoutingModule,
    SharedmoduleModule,
    ReactiveFormsModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })

  ],
  declarations: [GstRegistersComponent, GstrOneComponent, GstrTwoComponent, GstrThreeComponent, GstConsolidationsComponent]
})
export class GstReportsModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
