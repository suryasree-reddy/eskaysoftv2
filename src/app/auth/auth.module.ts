import { AuthRouter } from './auth.router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    AuthRouter,
    ReactiveFormsModule
  ],
  providers: [
    NgForm,
    NgModel,
    FormsModule
  ],
  declarations: [LoginComponent]
})
export class AuthModule { }
