import { AuthGuard } from './security/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


export const appRouter: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
    { path: 'dashboard', loadChildren:  './dashboard/dashboard.module#DashboardModule', canActivate: [AuthGuard] }
    
];

export const AppRouter: ModuleWithProviders = RouterModule.forRoot(appRouter);
