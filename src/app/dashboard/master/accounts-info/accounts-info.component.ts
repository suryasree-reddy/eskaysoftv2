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
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

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
  public scheduleForm: FormGroup;
  public districtsForm: FormGroup;
  public statesForm: FormGroup;
  private endPoint: string = "accountsInformation/";
  public gridDataList: any = [];
  public typeaheadDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public selectedTypeahead: any;
  public deleteFlag: boolean = true;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public formSuccess: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormServerError: boolean = false;
  public scFormSuccess: boolean = false;
  public duplicateMessage: string = null;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  public duplicateMessageParam: string = null;
  public nameFlag;
  public statesListColumns;
  public scheduleList: any = [];
  public subScheduleList: any = [];
  public districtsList: any = [];
  public statesList: any = [];
  public selectedSchedule: any;
  public selectedSubSchedule: any;
  public selectedState: any;
  public selectedDistrict: any;
  public distName;
  public stateZone: any[];
  public accGstType: any[];
  public accNatureOfGst: any[];
  public accCustomerType: any[];
  public accSaleType: any[];
  public accOpeningType: any[];

  scheduleTypes: any;
  private duplicateSchName: boolean = false;
  private duplicateSchIndex: boolean = false;
  private duplicateSubSchName: boolean = false;
  private duplicateStateName: boolean = false;
  private duplicateStateCode: boolean = false;
  private duplicateDistrictName: boolean = false;
  private duplicateDistrictCode: boolean = false;

  modalRef: BsModalRef;
  message: string;

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  // valueChange(selectedRow: any[]): void {
  //   this.editable(selectedRow);
  // }
  // onInitialDataLoad(dataList:any[]){
  //   this.subScheduleList = dataList;
  // }

  ngOnInit() {

    this.accInfoForm = this.fb.group({
      accountName: ['', Validators.required],
      subScheduleId: [],
      subScheduleName: ['', Validators.required],
      scheduleId: [],
      scheduleName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      town: ['', Validators.required],
      pin: ['', Validators.required],
      stateId: [],
      stateName: ['', Validators.required],
      areaId: ['', Validators.required],
      districtId: [],
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

    this.scheduleForm = this.fb.group({
      id: [],
      scheduleName: ['', Validators.required],
      scheduleIndex: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });
    this.subScheduleForm = this.fb.group({
      id: [],
      subScheduleName: ['', Validators.required],
      subScheduleIndex: ['', Validators.required],
      scheduleId: [],
      scheduleName: []
    });

    this.statesForm = this.fb.group({
      id: [],
      stateName: ['', Validators.required],
      stateCode: ['', Validators.required],
      zone: ['', Validators.required],
    });
    this.districtsForm = this.fb.group({
      id: [],
      districtName: ['', Validators.required],
      stateId: [],
      stateName: []
    });

    this.loadScheduleData();
    this.loadSubScheduleData();
    this.loadStatesData();
    this.loadDistrictData();
    // this.focusField.nativeElement.focus();
    this.scheduleTypes = this.sharedDataService.getSharedCommonJsonData().ScheduleTypes;
    this.accGstType = this.sharedDataService.getSharedCommonJsonData().GstType;
    this.accNatureOfGst = this.sharedDataService.getSharedCommonJsonData().NatureOfGst;
    this.accSaleType = this.sharedDataService.getSharedCommonJsonData().SaleType;
    this.accCustomerType = this.sharedDataService.getSharedCommonJsonData().CustomerType;
    this.accOpeningType = this.sharedDataService.getSharedCommonJsonData().OpeningType;
    this.stateZone = this.sharedDataService.getSharedCommonJsonData().StateZone;

  }

  loadScheduleData() {
    this.masterService.getParentData("schedules/").subscribe(list => {
      this.scheduleList = list;
    })
  }

  loadSubScheduleData() {
    this.masterService.getParentData("subschedules/").subscribe(list => {
      this.subScheduleList = list;
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

  onSelectState(event) {
    this.accInfoForm.patchValue({ stateName: event.item.stateName })
    this.selectedState = event.item;
  }

  onSelectSchedule(event) {
    this.selectedSchedule = event.item;
    this.accInfoForm.patchValue({ scheduleName: event.item.scheduleName })
    const temp = this.selectedSchedule.id;
     const selectedScheduleNameList = _.filter(this.subScheduleList, function(o) { return o.scheduleId == temp });
     this.subScheduleForm.patchValue({ subScheduleIndex: selectedScheduleNameList.length + 1 })
  }

  openModal(template: TemplateRef<any>) {
    // this.resetsubScheduleForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  saveSchedule() {
    if (this.scheduleForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveSchedule");
    } else {
      this.scRequiredErrMsg();
    }
  }

  saveSubSchedule() {
    if (this.subScheduleForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveSubSchedule");
    } else {
      this.scRequiredErrMsg();
    }
  }

  saveDistrict() {
    if (this.districtsForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveDistrict");
    } else {
      this.scRequiredErrMsg();
    }
  }

  saveScheduleForm() {
    this.masterService.createRecord("schedules/", this.scheduleForm.value).subscribe(res => {
      this.showInformationModal("SaveSchedule");
      this.modalRef.hide();
      this.scheduleForm.reset();
    }, (error) => {
      this.scServerErrMsg();
    });
  }

  saveSubScheduleForm() {
    this.masterService.createRecord("subschedules/", this.subScheduleForm.value).subscribe(res => {
      this.showInformationModal("SaveSubSchedule");
      this.modalRef.hide();
      // this.getScheduleTypes();
      this.subScheduleForm.reset();
    }, (error) => {
      this.scServerErrMsg();
    });
  }

  saveDistrictForm() {
    this.masterService.createRecord("districts/", this.districtsForm.value).subscribe(res => {
      this.showInformationModal("SaveDistrict");
      this.modalRef.hide();
      this.districtsForm.reset();
    }, (error) => {
      this.scServerErrMsg();
    });
  }

 
  resetSubScheduleForm() {
    this.scFormRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.subScheduleForm.reset();
  }

  resetScheduleForm() {
    this.scFormRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.scheduleForm.reset();
  }

  resetStatesForm() {
    this.childDuplicateMessageParam = null;
    this.childDuplicateMessage = null;
    this.scFormServerError = this.scFormRequiredError = this.scFormSuccess = false;
    this.statesForm.reset();
  }

  resetDistrictsForm() {
    this.childDuplicateMessageParam = null;
    this.childDuplicateMessage = null;
    this.scFormServerError = this.scFormRequiredError = this.scFormSuccess = false;
    this.districtsForm.reset();
  }

  // checkForDuplicateScheduleName() {
  //   this.duplicateSchName = this.masterService.hasDataExist(this.scheduleList, 'scheduleName', this.scheduleForm.value.scheduleName);
  //   this.getDuplicateErrorMessages();
  // }

  checkForDuplicateSubScheduleName() {
    this.duplicateSubSchName = this.masterService.hasDataExist(this.subScheduleList, 'subScheduleName', this.subScheduleForm.value.subScheduleName);
    // if (this.duplicateSubSchName) {
    //   const temp = this.subScheduleForm.value.subScheduleName;
    //   const subScheduleObj = _.filter(this.subScheduleList, function(o) { return o.subScheduleName.toLowerCase() == temp.toLowerCase() });
    //   this.subScheduleForm.patchValue({ id: subScheduleObj[0].id })
    // }
    this.getDuplicateErrorMessages();
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    this.duplicateSchIndex = this.masterService.hasDataExist(this.scheduleList, 'scheduleIndex', parseInt(this.scheduleForm.value.scheduleIndex));
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateStateCode() {
    this.duplicateStateCode = this.masterService.hasDataExist(this.statesList, 'stateCode', parseInt(this.statesForm.value.stateCode));
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateStateName() {
    this.duplicateStateName = this.masterService.hasDataExist(this.statesList, 'stateName', this.statesForm.value.stateName);
    if (this.duplicateStateName) {
      const temp = this.statesForm.value.stateName;
      const stateObj = _.filter(this.statesList, function(o) { return o.stateName.toLowerCase() == temp.toLowerCase() });
      this.statesForm.patchValue({ stateCode: stateObj[0].stateCode })
      this.statesForm.patchValue({ zone: stateObj[0].zone })
    }
    this.getDuplicateErrorMessages();
  }

  // checkForDuplicateDistrictCode() {
  //   this.duplicateStateCode = this.masterService.hasDataExist(this.districtsList, 'id', parseInt(this.districtsForm.value.id));
  //   this.getDuplicateErrorMessages();
  // }

  // checkForDuplicateScheduleName() {
  //   this.duplicateSchName = this.masterService.hasDataExist(this.scheduleList, 'scheduleName', this.scheduleForm.value.scheduleName);
  //   this.getDuplicateErrorMessages();
  // }

  checkForDuplicateDistrictName() {
    this.duplicateDistrictName = this.masterService.hasDataExist(this.districtsList, 'districtName', this.districtsForm.value.districtName);
    // if (this.duplicateDistrictName) {
    //   const temp = this.districtsForm.value.districtName;
    //   const districtObj = _.filter(this.districtsList, function(o) { return o.districtName.toLowerCase() == temp.toLowerCase() });
    //   this.districtsForm.patchValue({ id: districtObj[0].id })
    // }
    this.getDuplicateErrorMessages();
  }



  getDuplicateErrorMessages(): void {
    this.duplicateMessageParam = null;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.formRequiredError = false;
    this.scFormRequiredError = false;

      if (this.duplicateSubSchName) {
       this.childDuplicateMessage = "subschedule.duplicateNameErrorMessage";
       this.childDuplicateMessageParam = this.subScheduleForm.value.subScheduleName;
     }

     if (this.duplicateDistrictName) {
      this.childDuplicateMessage = "districts.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.districtsForm.value.districtName;
    }

    // if (this.duplicateSchName && this.duplicateSchIndex) {
    //   this.childDuplicateMessage = "schedule.duplicateErrorMessage";

    // } else if (this.duplicateSchIndex) {
    //   this.childDuplicateMessage = "schedule.duplicateIndexErrorMessage";
    //   this.childDuplicateMessageParam = this.scheduleForm.value.scheduleIndex;

    // } else if (this.duplicateSchName) {
    //   this.childDuplicateMessage = "schedule.duplicateNameErrorMessage";
    //   this.childDuplicateMessageParam = this.scheduleForm.value.scheduleName;
    // }
  }

  saveForm() {
    this.formRequiredError = false;
    if (this.accInfoForm.valid) {
      this.showConfirmationModal("Save");
    } else {
      this.serverErrMsg()
    }
  }


  save() {
    this.formRequiredError = false;
    if (this.accInfoForm.valid &&  this.duplicateMessage == null) {
      this.showConfirmationModal('Save');
    }
     else {
      this.requiredErrMsg();
    }
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = this.formServerError = false;
    }
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  scRequiredErrMsg() {
    if (this.childDuplicateMessage == null) {
      this.scFormRequiredError = true;
      this.scFormSuccess = this.scFormServerError = false;
    }
  }

  scServerErrMsg() {
    this.scFormServerError = true;
    this.scFormRequiredError = this.scFormSuccess = false;
  }

  resetForm() {
    this.loadScheduleData();
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.scFormRequiredError = false;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.duplicateMessageParam = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.duplicateSchIndex = false;
    this.duplicateSchName = false;
    this.duplicateSubSchName = false;
    this.duplicateDistrictName = false;
    // this.focusField.nativeElement.focus();
  }

  // editable(s) {
  //   this.nameFlag = true;
  //   this.editSubSchedule = s;
  //   this.formRequiredError = false;
  //   this.duplicateMessage = null;
  //   this.childDuplicateMessage = null;
  //   this.selectedSchedule = {};
  //   this.selectedSchedule.id = s.scheduleId;
  //   this.deleteFlag = false;
  //   this.duplicateMessage = null;
  //   this.duplicateMessageParam = null;
  //   this.subScheduleForm.reset(s);
  // }

  showInformationModal(eventType) {
    var msg;
    var title;
    // if (eventType === "Delete") {
    //   msg = 'subschedule.deleteInformationMessage';
    //   title = 'Sub-Schedule';
    // } else
    if (eventType === "SaveSchedule") {
      title = 'Schedule';
      msg = 'schedule.saveInformationMessage';
    }
    else if (eventType === "SaveSubSchedule") {
      title = 'Sub-Schedule';
      msg = 'subSchedule.saveInformationMessage';
    }
    else if (eventType === "SaveDistrict") {
      title = 'Districts';
      msg = 'districts.saveInformationMessage';
    }
    else {
      title = 'Account Information';
      msg = 'accountinfo.saveInformationMessage';
    }
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      title,
      msg,
      ''
    );
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => { this.successMsg(); });
  }

  showConfirmationModal(eventType): void {
    var msg;
    var title;
    // if (eventType === "Delete") {
    //   title = 'Sub-Schedule';
    //   msg = 'subschedule.deleteConfirmationMessage';
    // } else
    if (eventType === "SaveSchedule") {
      title = 'Schedule';
      msg = 'schedule.saveConfirmationMessage';
    }
    else if(eventType === "SaveSubSchedule") {
      title = 'Sub-Schedule';
      msg = 'subSchedule.saveConfirmationMessage';
    }
    else if(eventType === "SaveDistrict") {
      title = 'Districts';
      msg = 'districts.saveConfirmationMessage';
    }
    // else {
    //   title = 'Sub-Schedule';
    //   msg = 'subschedule.saveConfirmationMessage';
    // }
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      title,
      msg,
      'green',
      ''
    );

    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        // if (eventType === "Delete") {
        //   this.delete();
        // }
          if (eventType === "SaveSubSchedule") {
          this.saveSubScheduleForm();
        } 
       else if (eventType === "SaveDistrict") {
          this.saveDistrictForm();
        } else {
          this.saveForm();
        }
      }
    });
  }



}
