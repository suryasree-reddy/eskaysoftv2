import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-updateuser',
  templateUrl: './updateuser.component.html',
  styleUrls: ['./updateuser.component.scss']
})
export class UpdateuserComponent implements OnInit {

  private updateUserForm: FormGroup;
  private deleteFlag: boolean = true;
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  public updtUsrList: any = [];

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private sharedDataService: SharedDataService,
    private translate: TranslateService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() {
    this.updateUserForm = this.fb.group({
      userId: ['', Validators.required],
      name: ['', Validators.required],
      username: ['', Validators.required],
    });
  }

  checkForDuplicateName() {
    if (!this.nameFlag) {
      this.duplicateName = this.masterService.hasDataExist(this.updtUsrList, 'name', this.updateUserForm.value.name);
      this.getDuplicateErrorMessages();
    }

  }

  checkForDuplicateUserName() {
    if (!this.nameFlag) {
      this.duplicateUserName = this.masterService.hasDataExist(this.updtUsrList, 'username', this.updateUserForm.value.username);
      this.getDuplicateErrorMessages();
    }
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
    this.updateUserForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateName = false;
    this.duplicateUserName = false;
    this.formRequiredError = this.formSuccess = false;
  }

}
