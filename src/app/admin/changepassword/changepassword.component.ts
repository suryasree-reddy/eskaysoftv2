import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { AuthenticationService } from '../../auth/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.scss']
})

export class ChangepasswordComponent implements OnInit {

  private changePasswordForm: FormGroup;
  private deleteFlag: boolean = true;
  private formSuccess: boolean = false;
  private endPoint: string = "changePassword/";
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  public chgPswdList: any = [];
  private isPasswordNotMatch: boolean = false;

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService, private authService: AuthenticationService,
    private sharedDataService: SharedDataService, private router: Router,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      id: [],
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  checkForDuplicateUserName() {
    this.duplicateUserName = this.masterService.hasDataExist(this.chgPswdList, 'usernameOrEmail', this.changePasswordForm.value.usernameOrEmail);
    this.getDuplicateErrorMessages();
  }

  validatePassword() {
    if ((this.changePasswordForm.value.password != "" && this.changePasswordForm.value.password != null)
      && (this.changePasswordForm.value.confirmPassword != "" && this.changePasswordForm.value.confirmPassword != null)) {
      if (this.changePasswordForm.value.password != this.changePasswordForm.value.confirmPassword) {
        this.isPasswordNotMatch = true;
      } else {
        this.isPasswordNotMatch = false;
      }
    }
    this.getDuplicateErrorMessages();
  }


  getDuplicateErrorMessages(): void {
    if (!this.duplicateUserName) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }

    if (this.duplicateUserName) {
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.isPasswordNotMatch) {
      this.duplicateMessage = "changepassword.passwordMissmatch";
    }
  }

  save() {
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    this.router.navigate(['auth']);
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.changePasswordForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateUserName = false;
    this.formRequiredError = this.formSuccess = false;
  }
}
