import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


export const appRouter: Routes = [
    { path: '**', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
    
];

export const AppRouter: ModuleWithProviders = RouterModule.forRoot(appRouter);
