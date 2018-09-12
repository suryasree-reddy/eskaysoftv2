import { AuthRouter } from './auth.router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRouter
    
  ],
  declarations: [LoginComponent]
})
export class AuthModule { }
