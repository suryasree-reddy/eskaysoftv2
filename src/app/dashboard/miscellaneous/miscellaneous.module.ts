import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';

import { MiscellaneousRoutingModule } from './miscellaneous-routing.module';
import { DataIndexingComponent } from './data-indexing/data-indexing.component';
import { BackupComponent } from './backup/backup.component';
import { RestoreComponent } from './restore/restore.component';
import { CodeConversionComponent } from './code-conversion/code-conversion.component';
import { MultiProductcodeConversionComponent } from './multi-productcode-conversion/multi-productcode-conversion.component';
import { MultiareaCustomerConversionComponent } from './multiarea-customer-conversion/multiarea-customer-conversion.component';
import { LabelPrintComponent } from './label-print/label-print.component';
import { CustomerIndexingComponent } from './customer-indexing/customer-indexing.component';
import { AccountsRecheckingComponent } from './accounts-rechecking/accounts-rechecking.component';
import { CouponIssuesComponent } from './coupon-issues/coupon-issues.component';
import { CouponIssuesRegisterComponent } from './coupon-issues-register/coupon-issues-register.component';
import { ArticleIssuesComponent } from './article-issues/article-issues.component';
import { ArticleIssuesRegisterComponent } from './article-issues-register/article-issues-register.component';
import { YearEndComponent } from './year-end/year-end.component';

@NgModule({
  imports: [
    CommonModule,
    MiscellaneousRoutingModule,
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
  declarations: [DataIndexingComponent, BackupComponent, RestoreComponent, CodeConversionComponent, MultiProductcodeConversionComponent, MultiareaCustomerConversionComponent, LabelPrintComponent, CustomerIndexingComponent, AccountsRecheckingComponent, CouponIssuesComponent, CouponIssuesRegisterComponent, ArticleIssuesComponent, ArticleIssuesRegisterComponent, YearEndComponent]
})
export class MiscellaneousModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
