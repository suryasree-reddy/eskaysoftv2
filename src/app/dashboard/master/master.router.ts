import { AuthGuard } from './../../security/auth-guard.service';
import { SubscheduleComponent } from './subschedule/subschedule.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


export const masterRouter: Routes = [
    { path: '', redirectTo: 'schedule', pathMatch: 'full' },
    { path: 'schedule', component: ScheduleComponent, canActivate: [AuthGuard]  },
    { path: 'subschedule', component: SubscheduleComponent, canActivate: [AuthGuard]  },
    
];

export const MasterRouter: ModuleWithProviders = RouterModule.forChild(masterRouter);
