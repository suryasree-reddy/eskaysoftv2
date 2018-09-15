import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRouter } from 'src/app/dashboard/dashboard.router';
import { DashboardNavComponent } from './dashboard-nav/dashboard-nav.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRouter
  ],
  declarations: [DashboardComponent, DashboardNavComponent]
})
export class DashboardModule { }
