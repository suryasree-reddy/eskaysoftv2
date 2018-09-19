import { MasterRouter } from './master.router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleComponent } from './schedule/schedule.component';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscheduleComponent } from './subschedule/subschedule.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { AgGridModule } from 'ag-grid-angular';
import { BsDropdownModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    CommonModule,
    MasterRouter,
    ReactiveFormsModule,
    TypeaheadModule,
    AgGridModule,
    BsDropdownModule,
    FormsModule,
    ModalModule
  ],
  providers: [NgForm,
    NgModel,
    FormsModule,],
  declarations: [ScheduleComponent, SubscheduleComponent]
})
export class MasterModule { }
