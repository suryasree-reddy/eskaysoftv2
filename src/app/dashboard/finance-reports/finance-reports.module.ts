import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';

import { FinanceReportsRoutingModule } from './finance-reports-routing.module';
import { CashRegisterComponent } from './cash-register/cash-register.component';
import { CashBookComponent } from './cash-book/cash-book.component';
import { DayBookComponent } from './day-book/day-book.component';
import { GenledgerAccCopyComponent } from './genledger-acc-copy/genledger-acc-copy.component';
import { GroupAccCopyComponent } from './group-acc-copy/group-acc-copy.component';
import { TrailBalanceComponent } from './trail-balance/trail-balance.component';
import { TrailBalanceZoomComponent } from './trail-balance-zoom/trail-balance-zoom.component';
import { SchedulePrintComponent } from './schedule-print/schedule-print.component';
import { DebitorsOutstandingComponent } from './debitors-outstanding/debitors-outstanding.component';
import { AgeingAnalysisComponent } from './ageing-analysis/ageing-analysis.component';
import { CreditorsOutstandingComponent } from './creditors-outstanding/creditors-outstanding.component';
import { InterestCalculationComponent } from './interest-calculation/interest-calculation.component';
import { InterestCalculationGroupComponent } from './interest-calculation-group/interest-calculation-group.component';
import { InterestCalculationDuedaysComponent } from './interest-calculation-duedays/interest-calculation-duedays.component';
import { BalconfirmLetterComponent } from './balconfirm-letter/balconfirm-letter.component';
import { BalconfirmAccountcopyComponent } from './balconfirm-accountcopy/balconfirm-accountcopy.component';
import { CloseupAccountRegComponent } from './closeup-account-reg/closeup-account-reg.component';
import { DebitorsInterestAnalysisComponent } from './debitors-interest-analysis/debitors-interest-analysis.component';
import { SalesmanwiseOutstandingComponent } from './salesmanwise-outstanding/salesmanwise-outstanding.component';

@NgModule({
  imports: [
    CommonModule,
    FinanceReportsRoutingModule,
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
  declarations: [CashRegisterComponent, CashBookComponent, DayBookComponent, GenledgerAccCopyComponent, GroupAccCopyComponent, TrailBalanceComponent, TrailBalanceZoomComponent, SchedulePrintComponent, DebitorsOutstandingComponent, AgeingAnalysisComponent, CreditorsOutstandingComponent, InterestCalculationComponent, InterestCalculationGroupComponent, InterestCalculationDuedaysComponent, BalconfirmLetterComponent, BalconfirmAccountcopyComponent, CloseupAccountRegComponent, DebitorsInterestAnalysisComponent, SalesmanwiseOutstandingComponent]
})
export class FinanceReportsModule { }
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
