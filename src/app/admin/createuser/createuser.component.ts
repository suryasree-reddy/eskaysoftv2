import { Component, OnInit, NgModule, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationModelDialogComponent } from 'src/app/commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
// import * as _ from 'lodash';

@Component({
  selector: 'app-createuser',
  templateUrl: './createuser.component.html',
  styleUrls: ['./createuser.component.scss']
})


export class CreateuserComponent implements OnInit {

  private createUserForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "auth/createUser/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private rolesList: any = [];
  private userList: any = [];
  private isNewuser: boolean = false;
  private isPasswordNotMatch: boolean = false;
  modalRef: BsModalRef;

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private _routeParams: ActivatedRoute,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.createUserForm = this.fb.group({
      id: [],
      searchByUserName: [],
      name: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confPassword: ['', Validators.required],
      address1: ['', Validators.required],
      town: ['', Validators.required],
      pin: ['', Validators.required],
      mobile1: ['', Validators.required],
      roles: ['', Validators.required],
      designation: ['', Validators.required]
    });

    this.rolesList = this.sharedDataService.getSharedCommonJsonData().UserRoles;
    this.loadUserData();
  }

  loadUserData() {
    this.masterService.getData("users/");
    this.masterService.dataObject.subscribe(list => {
      this.userList = list;
    });
  }

  loadSelectedTypeahead(event) {
    this.createUserForm.reset(event.item);
    this.createUserForm.patchValue({ searchByUserName: event.item.username });
    this.deleteFlag = !event.item.deleteFlag;
    this.nameFlag = true;
    this.endPoint = "updateUser/";
    //  anand.kadiveti@gmail.com
  }

  checkForDuplicateName() {
    if (!this.nameFlag) {
      this.duplicateName = this.masterService.hasDataExist(this.userList, 'name', this.createUserForm.value.name);
      this.getDuplicateErrorMessages();
    }
  }

  checkForDuplicateUserName() {
    if (!this.nameFlag) {
      this.duplicateUserName = this.masterService.hasDataExist(this.userList, 'username', this.createUserForm.value.username);
      this.getDuplicateErrorMessages();
    }
  }

  validatePassword() {
    if ((this.createUserForm.value.password != "" && this.createUserForm.value.password != null)
      && (this.createUserForm.value.confPassword != "" && this.createUserForm.value.confPassword != null)) {
      if (this.createUserForm.value.password != this.createUserForm.value.confPassword) {
        this.isPasswordNotMatch = true;
      } else {
        this.isPasswordNotMatch = false;
      }
    }
    this.getDuplicateErrorMessages();
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateName || !this.duplicateUserName || !this.isPasswordNotMatch) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateName && this.duplicateUserName) {
      this.duplicateMessage = "createuser.duplicateNameErrorMessage";
    }
    else if (this.duplicateName) {
      this.duplicateMessage = "createuser.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.createUserForm.value.name;
    }
    else if (this.duplicateUserName) {
      this.duplicateMessage = "createuser.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.createUserForm.value.username;
    }

    if (this.isPasswordNotMatch) {
      this.duplicateMessage = "createuser.passwordMissmatch";
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
    this.loadUserData();
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
