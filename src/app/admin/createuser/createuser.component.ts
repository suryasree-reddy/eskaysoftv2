import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})

export class CreateuserComponent implements OnInit {

  private createUserForm: FormGroup;
  private deleteFlag: boolean = true;
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
  private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en');}

  ngOnInit() {
    this.createUserForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confPassword: ['', Validators.required],
      address: [],
      town: [],
      pin: [],
      district: [],
      state: [],
      phone: [],
      mobile: [],
      email: ['', Validators.required],
      roles: ['', Validators.required],
      designation: [],
    });

  }

  checkForDuplicateName() {

  }

  checkForDuplicateUserName() {

  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateName || !this.duplicateUserName) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
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
    this.resetForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.createUserForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateName = false;
    this.duplicateUserName = false;
    this.formRequiredError = this.formSuccess = false;
  }
}
