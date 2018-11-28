import { AuthGuard } from './../../security/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { SalesComponent } from 'src/app/dashboard/sales/sales/sales.component';
import { SalesReturnsComponent } from 'src/app/dashboard/sales/sales-returns/sales-returns.component';
import { SalesOrdersComponent } from 'src/app/dashboard/sales/sales-orders/sales-orders.component';
import { QuotationsComponent } from 'src/app/dashboard/sales/quotations/quotations.component';
import { DeliveryChallanComponent } from 'src/app/dashboard/sales/delivery-challan/delivery-challan.component';
import { ReportsComponent } from 'src/app/dashboard/sales/reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: 'sales', pathMatch: 'full' },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuard]  },
  { path: 'salesRetruns', component: SalesReturnsComponent, canActivate: [AuthGuard]  },
  { path: 'salesOrders', component: SalesOrdersComponent, canActivate: [AuthGuard]  },
  { path: 'deleiveryChallan', component: DeliveryChallanComponent, canActivate: [AuthGuard]  },
  { path: 'quotations', component: QuotationsComponent, canActivate: [AuthGuard]  },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard]  }
];

export const SalesRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
