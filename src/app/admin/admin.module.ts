import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDropdownModule, TypeaheadModule, TabsModule  } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgForm, NgModel, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import { SharedmoduleModule } from 'src/app/sharedmodule/sharedmodule.module';

import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangepasswordComponent } from './changepassword/changepassword.component';
import { CreateuserComponent } from './createuser/createuser.component';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
      SharedmoduleModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
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
  declarations: [UserProfileComponent, ChangepasswordComponent, CreateuserComponent]
})
export class AdminModule { }
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
