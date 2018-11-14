import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { UpdateuserComponent } from './updateuser/updateuser.component';

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
  declarations: [UserProfileComponent, ChangepasswordComponent, CreateuserComponent, UpdateuserComponent]
})
export class AdminModule { }
