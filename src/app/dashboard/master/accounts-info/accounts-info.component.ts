import { Component, OnInit, NgModule, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-accounts-info',
  templateUrl: './accounts-info.component.html'
})

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
  ],
})

export class AccountsInfoComponent implements OnInit {
  public accInfoForm: FormGroup;
  public subScheduleForm: FormGroup;
  public districtsForm: FormGroup;
  public areaForm: FormGroup;
  private endPoint: string = "accountinformation/";
  private taxEndPoint: string = "tax/";
  public deleteFlag: boolean = true;
  public formRequiredError: boolean = false;
  public formSuccess: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormSuccess: boolean = false;
  public duplicateMessage: string = null;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  public duplicateMessageParam: string = null;
  public nameFlag;
  public scheduleList: any = [];
  public subScheduleList: any = [];
  public districtsList: any = [];
  public statesList: any = [];
  public areasList: any = [];
  public businessExecList: any = [];
  public selectedSchedule: any;
  public selectedSubSchedule: any;
  public selectedDistrict: any;
  public selectedState: any;
  public selectedArea: any;
  public accGstType: any[];
  public accNatureOfGst: any[];
  public accCustomerType: any[];
  public accSaleType: any[];
  public accOpeningType: any[];
  private accountsList:any[];
  public selectedTaxTypeahead: any;
  private duplicateAreaName: boolean = false;
  public typeaheadTaxDataList: any = [];
  private duplicateSubSchName: boolean = false;
  private duplicateDistrictName: boolean = false;
  private duplicateAcctShortName: boolean = false;
  private duplicateAcctName: boolean = false;

  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() {

    this.accInfoForm = this.fb.group({
      id: [],
      subScheduleId: [],
      scheduleId: [],
      stateId: [],
      areaId: [],
      districtId: [],
      businessExecutiveId: [],
      accountName: ['', Validators.required],
      subScheduleName: ['', Validators.required],
      scheduleName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      town: ['', Validators.required],
      pin: ['', Validators.required],
      stateName: ['', Validators.required],
      areaName: ['', Validators.required],
      businessExecutiveName: ['', Validators.required],
      districtName: ['', Validators.required],
      phone: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', Validators.required],
      shortName: ['', Validators.required],
      licNo1: ['', Validators.required],
      licNo2: ['', Validators.required],
      licExpiry: ['', Validators.required],
      retLicNo1: ['', Validators.required],
      retLicNo2: ['', Validators.required],
      retExpiry: ['', Validators.required],
      foodLicNo: ['', Validators.required],
      otherLicense: ['', Validators.required],
      otherLicenseExpiry: ['', Validators.required],
      gstType: ['', Validators.required],
      gstIN: ['', Validators.required],
      natureOfGST: ['', Validators.required],
      uin: ['', Validators.required],
      saleType: ['', Validators.required],
      customerType: ['', Validators.required],
      creditLimit: ['', Validators.required],
      dueDays: ['', Validators.required],
      contactPerson: ['', Validators.required],
      hsnCode: ['', Validators.required],
      sacCode: ['', Validators.required],
      rateOfTax: ['', Validators.required],
      openingBalance: ['', Validators.required],
      openingType: ['', Validators.required],
      specialRemarks: ['', Validators.required]
    });

    this.subScheduleForm = this.fb.group({
      id: [],
      subScheduleName: ['', Validators.required],
      subScheduleIndex: ['', Validators.required],
      scheduleId: [],
      scheduleName: []
    });

    this.districtsForm = this.fb.group({
      id: [],
      districtName: ['', Validators.required],
      stateId: [],
      stateName: []
    });
    this.areaForm = this.fb.group({
      id: [],
      areaName: ['', Validators.required],
      businessExecutiveId: [],
      businessExecutiveName: []
    });
    this.loadGridData();
    this.loadSubScheduleData();
    this.loadDistrictData();
    this.loadAreaData();
    this.loadTaxTypeaheadData();
    // this.focusField.nativeElement.focus();
    this.accGstType = this.sharedDataService.getSharedCommonJsonData().GstType;
    this.accNatureOfGst = this.sharedDataService.getSharedCommonJsonData().NatureOfGst;
    this.accSaleType = this.sharedDataService.getSharedCommonJsonData().SaleType;
    this.accCustomerType = this.sharedDataService.getSharedCommonJsonData().CustomerType;
    this.accOpeningType = this.sharedDataService.getSharedCommonJsonData().OpeningType;
  }

  loadTaxTypeaheadData() {
    this.masterService.getParentData(this.taxEndPoint).subscribe(list => {
      this.typeaheadTaxDataList = list;
    });
  }

  loadSubScheduleData() {
    this.masterService.getParentData("subschedules/").subscribe(list => {
      this.subScheduleList = list;
    })
  }

  loadScheduleData() {
    this.masterService.getParentData("schedules/").subscribe(list => {
      this.scheduleList = list;
    })
  }

  loadStatesData() {
    this.masterService.getParentData("states/").subscribe(list => {
      this.statesList = list;
    })
  }

  loadDistrictData() {
    this.masterService.getParentData("districts/").subscribe(list => {
      this.districtsList = list;
    })
  }

  loadAreaData() {
    this.masterService.getParentData("area/").subscribe(list => {
      this.areasList = list;
    })
  }

  loadBusinessExecutiveData() {
    this.masterService.getParentData("businessexecutive/").subscribe(list => {
      this.businessExecList = list;
    })
  }

  loadSelectedTaxTypeahead(event) {
    this.selectedTaxTypeahead = event.item;
    this.accInfoForm.patchValue({ taxId: event.item.id });
  }

  onSelectDistrict(event) {
    this.selectedDistrict = event.item;
    this.accInfoForm.patchValue({ stateName: this.selectedDistrict.stateName });
    this.accInfoForm.patchValue({ districtId: this.selectedDistrict.id });
    this.accInfoForm.patchValue({ stateId: this.selectedDistrict.stateId });
  }

  onSelectState(event) {
     this.selectedState = event.item;
    this.districtsForm.patchValue({ stateId: this.selectedState.id });
    this.districtsForm.patchValue({ stateName: this.selectedState.stateName });
  }

  onSelectArea(event) {
    this.selectedArea = event.item;
    this.accInfoForm.value.areaId = this.selectedArea.id;
    this.accInfoForm.patchValue({ areaId: this.selectedArea.id });
    this.accInfoForm.patchValue({ businessExecutiveName: this.selectedArea.businessExecutiveName });
    this.accInfoForm.patchValue({ businessExecutiveId: this.selectedArea.businessExecutiveId });
  }

onSelectBusinessExecutive(event){
  this.areaForm.patchValue({ businessExecutiveId: event.item.id });
}

checkForDuplicateArea() {
    this.duplicateAreaName = this.masterService.hasDataExist(this.areasList, 'areaName', this.areaForm.value.areaName);
    this.getDuplicateErrorMessages();
}

  onSelectSubSchedule(event) {
    this.selectedSubSchedule = event.item;
    this.accInfoForm.patchValue({ subScheduleId: this.selectedSubSchedule.id });
    this.accInfoForm.patchValue({ scheduleId: this.selectedSubSchedule.scheduleId });
    this.accInfoForm.patchValue({ scheduleName: this.selectedSubSchedule.scheduleName });
    const temp = this.selectedSubSchedule.id;
    const selectedSubScheduleNameList = _.filter(this.subScheduleList, function(o) { return o.subScheduleId == temp });
    this.accInfoForm.patchValue({ subScheduleIndex: selectedSubScheduleNameList });
  }

  onSelectSchedule(event) {
    this.selectedSchedule = event.item;
    const temp = this.selectedSchedule.id;

    this.subScheduleForm.patchValue({ scheduleId: this.selectedSchedule.id });
    this.subScheduleForm.patchValue({ scheduleName: this.selectedSchedule.scheduleName });
    const selectedScheduleNameList = _.filter(this.subScheduleList, function(o) { return o.scheduleId == temp });
    this.subScheduleForm.patchValue({ subScheduleIndex: selectedScheduleNameList.length + 1 });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.accountsList = list;
    });
  }

  loadSelectedTypeahead(event) {
    this.accInfoForm.reset(event.item);
    this.nameFlag = true;
    this.deleteFlag = !event.item.deleteFlag;
  }

  openModal(template: TemplateRef<any>, templateName) {
    if (templateName == "SubSchedule") {
      this.resetChildForm(this.subScheduleForm);
      this.loadScheduleData();
    } else if (templateName == "Districts") {
      this.resetChildForm(this.districtsForm);
      this.loadStatesData();
    } else if (templateName == "Area") {
      this.resetChildForm(this.areaForm);
      this.loadBusinessExecutiveData();
    }
    //template, 'SubSchedule'
    this.scFormRequiredError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  saveChildForm(screenName, formObj) {
    this.scFormRequiredError = false;
    if (formObj.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal(screenName);
    } else {
      this.scRequiredErrMsg()
    }
  }

  saveChild(screenName, formObj, targetUrl) {
    this.masterService.createRecord(targetUrl, formObj.value).subscribe(res => {
      this.showInformationModal(screenName);
      if (screenName == "SubSchedule") {
        this.loadSubScheduleData();
      } else if (screenName == "District") {
        this.loadDistrictData();
      }  else if (screenName == "Area") {
        this.loadAreaData();
      }
      this.modalRef.hide();
      formObj.reset();
    }, (error) => {
      throw error;
    });
  }

  resetChildForm(formObj) {
    this.scFormRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.scFormRequiredError = this.scFormSuccess = false;
    // formObj.reset();
    this.subScheduleForm.reset();
    this.districtsForm.reset();
    this.areaForm.reset();
  }

  checkForDuplicateSubScheduleName() {
    this.duplicateSubSchName = this.masterService.hasDataExist(this.subScheduleList, 'subScheduleName', this.subScheduleForm.value.subScheduleName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateDistrictName() {
    this.duplicateDistrictName = this.masterService.hasDataExist(this.districtsList, 'districtName', this.districtsForm.value.districtName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateAcctName() {
    this.duplicateAcctName = this.masterService.hasDataExist(this.accountsList, 'accountName', this.accInfoForm.value.accountName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateAcctShortName() {
    this.duplicateAcctShortName = this.masterService.hasDataExist(this.accountsList, 'shortName', this.accInfoForm.value.shortName);
    this.getDuplicateErrorMessages();
  }

  getDuplicateErrorMessages(): void {

    if (!this.duplicateSubSchName || !this.duplicateDistrictName || !this.duplicateAreaName) {
      this.childDuplicateMessage = null;
      this.childDuplicateMessageParam = null;
      this.scFormRequiredError = false;
    }

    if (!this.duplicateAcctShortName || !this.duplicateAcctShortName) {
      this.duplicateMessageParam = null;
      this.duplicateMessage = null;
      this.formRequiredError = false;
    }

    if (this.duplicateSubSchName) {
      this.childDuplicateMessage = "subschedule.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.subScheduleForm.value.subScheduleName;
    }
    else if (this.duplicateDistrictName) {
      this.childDuplicateMessage = "districts.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.districtsForm.value.districtName;

    }else if(this.duplicateAreaName){
      this.childDuplicateMessage = "areas.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.areaForm.value.areaName;
    }

    if (this.duplicateAcctShortName && this.duplicateAcctName) {
        this.duplicateMessage = "accountinfo.duplicateErrorMessage";

    }else if (this.duplicateAcctName) {
      this.duplicateMessage = "accountinfo.duplicateNameErrorMessage";
        this.duplicateMessageParam = this.accInfoForm.value.accountName;

    }else if (this.duplicateAcctShortName) {
      this.duplicateMessage = "accountinfo.duplicateShortNameErrorMessage";
        this.duplicateMessageParam = this.accInfoForm.value.shortName;
    }
}
    save() {
      if (this.accInfoForm.value.id) {
        this.masterService.updateRecord(this.endPoint, this.accInfoForm.value).subscribe(res => {
          this.showInformationModal("Save");
        }, (error) => {
          throw error;
        });
      } else {
        this.masterService.createRecord(this.endPoint, this.accInfoForm.value).subscribe(res => {
          this.showInformationModal("Save");
        }, (error) => {
          throw error;
        });
      }
    }


  delete() {
    this.buttonsComponent.delete();
    // this.masterService.deleteRecord(this.endPoint, this.gridSelectedRow.id).subscribe(res => {
    // localStorage.removeItem('ag-activeRow');
    // this.showInformationModal("Delete");
    // this.successMsg()
    // }, (error) => {
    //   throw error;
    // });
  }

    successMsg() {
      this.formSuccess = true;
      this.formRequiredError = false;
      this.loadGridData();
      this.accInfoForm.reset();
      this.resetForm();
    }

    requiredErrMsg() {
      if (this.duplicateMessage == null) {
        this.formRequiredError = true;
        this.formSuccess = false;
      }
    }

    scRequiredErrMsg() {
      if (this.childDuplicateMessage == null) {
        this.scFormRequiredError = true;
        this.scFormSuccess = false;
      }
    }

    resetForm() {
      this.formRequiredError = this.formSuccess = false;
      this.scFormRequiredError = false;
      this.nameFlag = false;
      this.deleteFlag = true;
      this.duplicateMessage = null;
      this.childDuplicateMessage = null;
      this.duplicateMessageParam = null;
      this.childDuplicateMessage = null;
      this.childDuplicateMessageParam = null;
      this.duplicateSubSchName = false;
      this.duplicateDistrictName = false;
      this.accInfoForm.reset();
      // this.focusField.nativeElement.focus();
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
        else if (eventType == "SubSchedule") {
          this.saveChild(eventType, this.subScheduleForm, "subschedules/");
        }
        else if (eventType == "District") {
          this.saveChild(eventType, this.districtsForm, "districts/");
        }
        else if (eventType == "Area") {
          this.saveChild(eventType, this.areaForm, "area/");
        }
      }
    });
  }

  getFormDetails(screenName) {

    if (screenName == "Save") {
      return { "title": "Account Information", "confirmMessage": "accountinfo.saveConfirmationMessage", "infoMessage": "accountinfo.saveInformationMessage" };
    }
    else if (screenName == "Delete") {
      return { "title": "Account Information", "confirmMessage": "accountinfo.deleteConfirmationMessage", "infoMessage": "accountinfo.deleteInformationMessage" };
    }
    else if (screenName == "SubSchedule") {
      return { "title": "Sub-Schedule", "confirmMessage": "subschedule.saveConfirmationMessage", "infoMessage": "subschedule.saveInformationMessage" };
    }
    else if (screenName == "District") {
      return { "title": "Districts", "confirmMessage": "districts.saveConfirmationMessage", "infoMessage": "districts.saveInformationMessage" };
    }
    else if (screenName == "Area") {
      return { "title": "Area", "confirmMessage": "areas.saveConfirmationMessage", "infoMessage": "areas.saveInformationMessage" };
    }
  }


}
