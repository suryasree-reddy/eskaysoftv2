import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreateuserComponent } from './createuser/createuser.component';

export const adminRouter: Routes = [
  { path: '', redirectTo: 'userProfile', pathMatch: 'full' },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'changePassword', component: ChangepasswordComponent },
  { path: 'createUser', component: CreateuserComponent },
  { path: 'updateUser', component: CreateuserComponent },

];
export const AdminRoutingModule: ModuleWithProviders = RouterModule.forChild(adminRouter);
