import { AuthGuard } from 'src/app/security/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { PurchaseDashboardComponent } from './purchase-dashboard/purchase-dashboard.component';

export const purchaseRouter: Routes = [
    { path: '', redirectTo: 'purchase-dashboard', pathMatch: 'full' },
    { path: 'purchase-dashboard', component: PurchaseDashboardComponent, canActivate: [AuthGuard]  }
];

export const PurchaseRouter: ModuleWithProviders = RouterModule.forChild(purchaseRouter);
