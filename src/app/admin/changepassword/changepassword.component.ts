import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { AuthenticationService } from '../../auth/authentication.service';

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

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService, private authService: AuthenticationService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() {
    this.changePasswordForm = this.fb.group({
      // name: ['', Validators.required],
      id:[],
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
      // email: ['', Validators.required],
      // roles: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      // address: ['', Validators.required],
      // town: ['', Validators.required],
      // designation: ['', Validators.required],
      // mobile: ['', Validators.required]
    });
  //  this.authService.logout();
  }

  checkForDuplicateUserName() {
      this.duplicateUserName = this.masterService.hasDataExist(this.chgPswdList, 'usernameOrEmail', this.changePasswordForm.value.usernameOrEmail);
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
  }

  save() {
    //this.changePasswordForm.patchValue({ id: "test" })
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    this.resetForm();
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
