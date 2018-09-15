import { ScheduleComponent } from './schedule/schedule.component';
import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';


export const masterRouter: Routes = [
    { path: '', redirectTo: 'schedule', pathMatch: 'full' },
    { path: 'schedule', component: ScheduleComponent },
    
];

export const MasterRouter: ModuleWithProviders = RouterModule.forChild(masterRouter);
