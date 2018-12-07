import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';
import { FinanceRoutingModule } from './finance-routing.module';
import { PaymentVouchersComponent } from './payment-vouchers/payment-vouchers.component';
import { ReceiptVouchersComponent } from './receipt-vouchers/receipt-vouchers.component';
import { GstpaymentVouchersComponent } from './gstpayment-vouchers/gstpayment-vouchers.component';
import { JournalVouchersComponent } from './journal-vouchers/journal-vouchers.component';
import { SuppissuedCreditentryComponent } from './suppissued-creditentry/suppissued-creditentry.component';
import { SuppissuedDebitentryComponent } from './suppissued-debitentry/suppissued-debitentry.component';
import { RcmInvoiceComponent } from './rcm-invoice/rcm-invoice.component';
import { GenpurchasesGstComponent } from './genpurchases-gst/genpurchases-gst.component';
import { GensalesGstComponent } from './gensales-gst/gensales-gst.component';
import { RegisterComponent } from './register/register.component';

@NgModule({
  imports: [
    CommonModule,
    FinanceRoutingModule,
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
  declarations: [PaymentVouchersComponent, ReceiptVouchersComponent, GstpaymentVouchersComponent, JournalVouchersComponent, SuppissuedCreditentryComponent, SuppissuedDebitentryComponent, RcmInvoiceComponent, GenpurchasesGstComponent, GensalesGstComponent, RegisterComponent]
})
export class FinanceModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
