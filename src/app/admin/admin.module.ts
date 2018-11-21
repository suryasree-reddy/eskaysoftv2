import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule, TypeaheadModule, TabsModule  } from 'ngx-bootstrap';

import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreateuserComponent } from './createuser/createuser.component';
import { UpdateuserComponent } from './updateuser/updateuser.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
      SharedmoduleModule,
    ReactiveFormsModule,
    HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })
  ],
  providers: [
    NgForm,
    NgModel,
    FormsModule
  ],
  declarations: [UserProfileComponent, ChangepasswordComponent, CreateuserComponent, UpdateuserComponent]
})
export class AdminModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
