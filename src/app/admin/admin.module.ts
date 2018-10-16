import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    NgForm,
    NgModel,
    FormsModule
  ],
  declarations: [UserProfileComponent]
})
export class AdminModule { }
