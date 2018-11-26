import { Component, OnInit, NgModule, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ConfirmationModelDialogComponent } from 'src/app/commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot()
  ],
})
export class UserProfileComponent implements OnInit {

  private userProfileForm: FormGroup;
  public districtsForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "updateUser/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private userprofileList: any = [];
  private accGstType: any[];
  private accNatureOfGst: any[];
  private accSaleType: any[];
  private accCustomerType: any[];
  public districtsList: any = [];
  public statesList: any = [];
  private duplicateDistrictName: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormSuccess: boolean = false;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  modalRef: BsModalRef;

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private authenticationService: AuthenticationService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.userProfileForm = this.fb.group({
      id: [],
      districtId: [],
      name: ['', Validators.required],
      username: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      town: ['', Validators.required],
      pin: ['', Validators.required],
      districtName: ['', Validators.required],
      state: ['', Validators.required],
      stateCode: ['', Validators.required],
      phone: ['', Validators.required],
      mobile1: ['', Validators.required],
      mobile2: ['', Validators.required],
      contactPerson: ['', Validators.required],
      contactPersonMobile: ['', Validators.required],
      natureOfBusiness: ['', Validators.required],
      bankName1: ['', Validators.required],
      bankAcNo1: ['', Validators.required],
      bankIfscNo1: ['', Validators.required],
      bankName2: ['', Validators.required],
      bankAcNo2: ['', Validators.required],
      bankIfscNo2: ['', Validators.required],
      licNo1: ['', Validators.required],
      licNo2: ['', Validators.required],
      licExpiry: ['', Validators.required],
      retLicNo1: ['', Validators.required],
      retLicNo2: ['', Validators.required],
      retExpiry: ['', Validators.required],
      foodLicNo: ['', Validators.required],
      otherLicense: ['', Validators.required],
      otherLicenseExpiry: ['', Validators.required],
      gstIN: ['', Validators.required],
      gstType: ['', Validators.required],
      natureOfGST: ['', Validators.required],
      uin: ['', Validators.required],
      creditLimit: ['', Validators.required],
      dueDays: ['', Validators.required],
      saleType: ['', Validators.required],
      customerType: ['', Validators.required],
      roles: [],
      email: [],
      designation: []
    });

    this.districtsForm = this.fb.group({
      id: [],
      districtName: ['', Validators.required],
      stateId: [],
      stateName: []
    });
    this.loadDistrictData();
    this.accGstType = this.sharedDataService.getSharedCommonJsonData().GstType;
    this.accNatureOfGst = this.sharedDataService.getSharedCommonJsonData().NatureOfGst;
    this.accSaleType = this.sharedDataService.getSharedCommonJsonData().SaleType;
    this.accCustomerType = this.sharedDataService.getSharedCommonJsonData().CustomerType;
    this.loadUserData();
  }

  loadUserData() {
    this.masterService.getData("users/" + this.authenticationService.getCurrentUserName());
    this.masterService.dataObject.subscribe(item => {
      this.userProfileForm.reset(item);
      //  this.deleteFlag = !event.item.deleteFlag;
      this.nameFlag = true;
      this.endPoint = "updateUser/";
    });
  }

  loadDistrictData() {
    this.masterService.getParentData("districts/").subscribe(list => {
      this.districtsList = list;
    })
  }

  loadStatesData() {
    this.masterService.getParentData("states/").subscribe(list => {
      this.statesList = list;
    })
  }

  onSelectDistrict(event) {
    this.userProfileForm.patchValue({ state: event.item.stateName });
    this.userProfileForm.patchValue({ districtId: event.item.id });
    this.userProfileForm.patchValue({ districtName: event.item.districtName });
    this.userProfileForm.patchValue({ stateCode: event.item.stateId });
  }

  openModal(template: TemplateRef<any>, templateName) {
    if (templateName == "Districts") {
      this.resetChildForm(this.districtsForm);
      this.loadStatesData();
    }
    //template, 'SubSchedule'
    this.scFormRequiredError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  resetChildForm(formObj) {
    this.scFormRequiredError = false;
    this.duplicateDistrictName = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.scFormRequiredError = this.scFormSuccess = false;
    // formObj.reset();
    this.districtsForm.reset();
  }

  saveChildForm(screenName, formObj) {
    this.scFormRequiredError = false;
    if (formObj.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal(screenName);
    } else {
      this.scRequiredErrMsg()
    }
  }


  scRequiredErrMsg() {
    if (this.childDuplicateMessage == null) {
      this.scFormRequiredError = true;
      this.scFormSuccess = false;
    }
  }

  saveChild(screenName, formObj, targetUrl) {
    this.masterService.createRecord(targetUrl, formObj.value).subscribe(res => {
      this.showInformationModal(screenName);
      if (screenName == "District") {
        this.loadDistrictData();
      }
      this.modalRef.hide();
      formObj.reset();
    }, (error) => {
      throw error;
    });
  }


  checkForDuplicateDistrictName() {
    this.duplicateDistrictName = this.masterService.hasDataExist(this.districtsList, 'districtName', this.districtsForm.value.districtName);
    this.getDuplicateErrorMessages();
  }


  checkForDuplicateName() {
    if (!this.nameFlag) {
      this.duplicateUserName = this.masterService.hasDataExist(this.userprofileList, 'Email', this.userProfileForm.value.Email);
      this.getDuplicateErrorMessages();
    }
  }

  checkForDuplicateUserName() {
    if (!this.nameFlag) {
      this.duplicateUserName = this.masterService.hasDataExist(this.userprofileList, 'UserName', this.userProfileForm.value.username);
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateName || !this.duplicateUserName) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateDistrictName) {
      this.childDuplicateMessage = "districts.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.districtsForm.value.districtName;
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
    this.loadDistrictData();
    this.accGstType = this.sharedDataService.getSharedCommonJsonData().GstType;
    this.accNatureOfGst = this.sharedDataService.getSharedCommonJsonData().NatureOfGst;
    this.accSaleType = this.sharedDataService.getSharedCommonJsonData().SaleType;
    this.accCustomerType = this.sharedDataService.getSharedCommonJsonData().CustomerType;
    this.loadUserData();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.userProfileForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateName = false;
    this.duplicateUserName = false;
    this.formRequiredError = this.formSuccess = false;
    this.duplicateDistrictName = false;
    this.districtsForm.reset();
  }


  showInformationModal(eventType) {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      this.getFormDetails(eventType).title,
      this.getFormDetails(eventType).infoMessage,
      ''
    );
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => { this.successMsg(); });
  }

  showConfirmationModal(eventType): void {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      this.getFormDetails(eventType).title,
      this.getFormDetails(eventType).confirmMessage,
      'green',
      ''
    );

    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        if (eventType == "Delete") {
          this.delete();
        }
        else if (eventType == "District") {
          this.saveChild(eventType, this.districtsForm, "districts/");
        }
      }
    });
  }

  getFormDetails(screenName) {
    if (screenName == "Save") {
      return { "title": "Profile", "confirmMessage": "userprofile.saveConfirmationMessage", "infoMessage": "userprofile.saveInformationMessage" };
    }
    else if (screenName == "District") {
      return { "title": "Districts", "confirmMessage": "districts.saveConfirmationMessage", "infoMessage": "districts.saveInformationMessage" };
    }
  }

}
