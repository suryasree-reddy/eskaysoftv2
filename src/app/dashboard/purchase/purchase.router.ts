import { AuthGuard } from './../../security/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PurchaseDashboardComponent } from './purchase-dashboard/purchase-dashboard.component';
import { InternalStockAdjComponent } from './internal-stock-adj/internal-stock-adj.component';
import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { ReportsComponent } from './reports/reports.component';

export const purchaseRouter: Routes = [
    { path: '', redirectTo: 'purchase-dashboard', pathMatch: 'full' },
    { path: 'purchase-dashboard', component: PurchaseDashboardComponent, canActivate: [AuthGuard]  },
    { path: 'purchase-order', component: PurchaseOrderComponent, canActivate: [AuthGuard]  },
    { path: 'internal-stock-adj', component: InternalStockAdjComponent, canActivate: [AuthGuard]  },
    { path: 'purchase-returns', component: PurchaseReturnsComponent, canActivate: [AuthGuard]  },
	  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard]  }

];

export const PurchaseRouter: ModuleWithProviders = RouterModule.forChild(purchaseRouter);
