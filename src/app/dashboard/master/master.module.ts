import { MasterRouter } from './master.router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';

@NgModule({
  imports: [
    CommonModule,
    MasterRouter
  ],
  declarations: [ScheduleComponent]
})
export class MasterModule { }
