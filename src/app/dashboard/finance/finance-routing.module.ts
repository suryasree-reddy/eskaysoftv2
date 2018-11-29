import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/security/auth-guard.service';

export const routes: Routes = [
  { path: '', redirectTo: 'schedule', pathMatch: 'full' },
//  { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard]  },
];

export const FinanceRoutingModule: ModuleWithProviders = RouterModule.forChild(routes);
