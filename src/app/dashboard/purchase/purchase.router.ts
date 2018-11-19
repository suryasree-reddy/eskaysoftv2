import { AuthGuard } from './../../security/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PurchaseDashboardComponent } from './purchase-dashboard/purchase-dashboard.component';
import { InternalStockAdjComponent } from './internal-stock-adj/internal-stock-adj.component';
import { MfgwisePurchaseRegComponent } from './mfgwise-purchase-reg/mfgwise-purchase-reg.component';
import { OrderPurchaseRegisterComponent } from './order-purchase-register/order-purchase-register.component';
import { PurchaseRegisterComponent } from './purchase-register/purchase-register.component';
import { PurchaseReturnsComponent } from './purchase-returns/purchase-returns.component';
import { PurchaseReturnsRegisterComponent } from './purchase-returns-register/purchase-returns-register.component';

export const purchaseRouter: Routes = [
    { path: '', redirectTo: 'purchase-dashboard', pathMatch: 'full' },
    { path: 'purchase-dashboard', component: PurchaseDashboardComponent, canActivate: [AuthGuard]  },
    { path: 'internal-stock-adj', component: InternalStockAdjComponent, canActivate: [AuthGuard]  },
    { path: 'mfgwise-purchase-reg', component: MfgwisePurchaseRegComponent, canActivate: [AuthGuard]  },
    { path: 'order-purchase-register', component: OrderPurchaseRegisterComponent, canActivate: [AuthGuard]  },
    { path: 'purchase-register', component: PurchaseRegisterComponent, canActivate: [AuthGuard]  },
    { path: 'purchase-returns-register', component: PurchaseReturnsRegisterComponent, canActivate: [AuthGuard]  },
    { path: 'purchase-returns', component: PurchaseReturnsComponent, canActivate: [AuthGuard]  }
];

export const PurchaseRouter: ModuleWithProviders = RouterModule.forChild(purchaseRouter);
