import { DashboardComponent } from './dashboard.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


export const dashboardRouter: Routes = [
    {
        path: '', component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'master' },
            { path: 'master', loadChildren: './master/master.module#MasterModule' }
        ]
    },


];

export const DashboardRouter: ModuleWithProviders = RouterModule.forChild(dashboardRouter);
