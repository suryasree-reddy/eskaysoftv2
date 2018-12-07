import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';

import { InventoryReportsRoutingModule } from './inventory-reports-routing.module';
import { AreaReportsComponent } from './area-reports/area-reports.component';
import { CompanyReportsComponent } from './company-reports/company-reports.component';
import { CustomerReportsComponent } from './customer-reports/customer-reports.component';
import { ProductReportsComponent } from './product-reports/product-reports.component';
import { PurchaseReportsComponent } from './purchase-reports/purchase-reports.component';
import { RepReportsComponent } from './rep-reports/rep-reports.component';
import { SaleReportsComponent } from './sale-reports/sale-reports.component';
import { StockReportsComponent } from './stock-reports/stock-reports.component';
import { HsnCompwiseListComponent } from './hsn-compwise-list/hsn-compwise-list.component';
import { SalesmanwiseAnalysisComponent } from './salesmanwise-analysis/salesmanwise-analysis.component';

@NgModule({
  imports: [
    CommonModule,
    InventoryReportsRoutingModule,
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
  declarations: [AreaReportsComponent, CompanyReportsComponent, CustomerReportsComponent, ProductReportsComponent, PurchaseReportsComponent, RepReportsComponent, SaleReportsComponent, StockReportsComponent, HsnCompwiseListComponent, SalesmanwiseAnalysisComponent]
})
export class InventoryReportsModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
