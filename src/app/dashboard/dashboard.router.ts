import { AuthGuard } from './../security/auth-guard.service';
import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ForbiddenComponent } from './forbidden/forbidden.component';

export const dashboardRouter: Routes = [
  {
    path: '', component: DashboardComponent,    
    children: [
      { path: '', redirectTo: 'master' },
      { path: 'master', loadChildren: './master/master.module#MasterModule', canActivate: [AuthGuard],
        data: { 
          roles: ['ROLE_ADMIN', 'ALLOW_MASTERS']
        }  },
      { path: 'purchase', loadChildren: './purchase/purchase.module#PurchaseModule', canActivate: [AuthGuard],
        data: { 
          roles: ['ROLE_ADMIN', 'ALLOW_PURCHASE']
        }  },
      { path: 'sales', loadChildren: './sales/sales.module#SalesModule', canActivate: [AuthGuard],
        data: { 
          roles: ['ROLE_ADMIN', 'ALLOW_SALES']
        }  },
      { path: 'forbidden', component: ForbiddenComponent }
    ]
  },
  
];

export const DashboardRouter: ModuleWithProviders = RouterModule.forChild(dashboardRouter);
