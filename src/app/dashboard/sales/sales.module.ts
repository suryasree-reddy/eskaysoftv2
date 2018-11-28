import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule, TypeaheadModule, AccordionModule, TabsModule } from 'ngx-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales/sales.component';
import { SalesReturnsComponent } from './sales-returns/sales-returns.component';
import { SalesOrdersComponent } from './sales-orders/sales-orders.component';
import { ReportsComponent } from './reports/reports.component';
import { DeliveryChallanComponent } from './delivery-challan/delivery-challan.component';
import { QuotationsComponent } from './quotations/quotations.component';

@NgModule({
  imports: [
    CommonModule,
    SalesRoutingModule,
    ReactiveFormsModule,
    SharedmoduleModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
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
  providers: [NgForm,
    NgModel,
    FormsModule
  ],
  declarations: [SalesComponent, SalesReturnsComponent, SalesOrdersComponent, ReportsComponent, DeliveryChallanComponent, QuotationsComponent]
})
export class SalesModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
