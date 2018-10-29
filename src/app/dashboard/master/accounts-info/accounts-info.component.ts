import { Component, OnInit, NgModule,  TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule, TabsModule  } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
// import $ from "jquery";

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
  private endPoint: string = "accountsInformation/";
  public scheduleForm: FormGroup;
  public districtsForm: FormGroup;
  public statesForm: FormGroup;
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
  scheduleList: any = [];
  public subScheduleList: any = [];
  public districtsList: any = [];
  public statesList: any = [];
  public selectedSchedule: any;
  public selectedState: any;
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
      subScheduleId: ['', Validators.required],
      scheduleId: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      town: ['', Validators.required],
      pin: ['', Validators.required],
      stateId: ['', Validators.required],
      areaId: ['', Validators.required],
      districtId: ['', Validators.required],
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




    // this.loadTypeaheadData();
    // //this.loadGridData();
    // this.focusField.nativeElement.focus();
    //this.getGridCloumsList();
    //this.getJsonData();
    this.loadScheduleData();
    this.loadStatesData();
    this.loadDistrictData() 
    // this.focusField.nativeElement.focus();
    this.getScheduleTypes();
    this.getGstType();
    this.getNatureOfGst();
    this.getSaleType();
    this.getCustomerType();
    this.getOpeningType();

  }

  loadScheduleData() {
    this.masterService.getParentData("schedules/").subscribe(list => {
      this.scheduleList = list;
    })
  }

  loadsubScheduleData() {
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


  // onSelectSchedule(event) {
  //   this.selectedSchedule = event.item;
  //   const temp = this.selectedSchedule.id;
  //   const selectedScheduleNameList = _.filter(this.subScheduleList, function(o) { return o.scheduleId == temp });
  //   this.subScheduleForm.patchValue({ subScheduleIndex: selectedScheduleNameList.length + 1 })
  // }

  openModal(template: TemplateRef<any>) {
    // this.resetsubScheduleForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  getScheduleTypes() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.scheduleTypes = data["ScheduleTypes"];
      //  this.subScheduleListColumns = data["SubScheduleListColumns"];
    });
  }

  getGstType() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.accGstType = data["GstType"];
    });
  }
  getNatureOfGst(){
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.accNatureOfGst = data["NatureOfGst"];
    });
  }
  getCustomerType() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.accCustomerType = data["CustomerType"];
    });
  }

  getSaleType(){
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.accSaleType = data["SaleType"];
    });
  }

  getOpeningType(){
    this.masterService.getLocalJsonData().subscribe(data =>{
      data as object[];
      this.accOpeningType = data["OpeningType"];
      });
  }


  saveSchedule() {
    if (this.scheduleForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveSchedule");
    } else {
      this.scRequiredErrMsg();
    }
  }

  saveScheduleForm() {
    this.masterService.createRecord("schedules/", this.scheduleForm.value).subscribe(res => {
      this.showInformationModal("SaveSchedule");
      this.modalRef.hide();
      this.getScheduleTypes();
      this.scheduleForm.reset();
    }, (error) => {
      this.scServerErrMsg();
    });
  }

  saveState() {
    if (this.statesForm.valid) {
      this.masterService.createRecord("states/", this.statesForm.value).subscribe(res => {
       // this.buttonsComponent.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });

    } else {
      this.requiredErrMsg();
    }
  }

  resetsubScheduleForm() {
    this.scFormRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.subScheduleForm.reset();
  }

  resetStatesForm() {
    this.childDuplicateMessageParam = null;
    this.childDuplicateMessage = null;
    // this.getZone();
    this.scFormServerError = this.scFormRequiredError = this.scFormSuccess = false;
    this.statesForm.reset();
  }


  checkForDuplicateScheduleName() {
    this.duplicateSchName = this.masterService.hasDataExist(this.scheduleList, 'scheduleName', this.scheduleForm.value.scheduleName);
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

  checkForDuplicateDistrictName() {
    this.duplicateDistrictName = this.masterService.hasDataExist(this.districtsList, 'districtName', this.districtsForm.value.districtName);
    if (this.duplicateDistrictName) {
      const temp = this.districtsForm.value.districtName;
      const districtObj = _.filter(this.districtsList, function(o) { return o.districtName.toLowerCase() == temp.toLowerCase() });
      this.districtsForm.patchValue({ id: districtObj[0].id })
      
    }
    this.getDuplicateErrorMessages();
  }
  getDuplicateErrorMessages(): void {
      this.duplicateMessageParam = null;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
	this.formRequiredError = false;
  this.scFormRequiredError= false;

  //   if (this.duplicateSubSchName) {
  //    this.duplicateMessage = "subschedule.duplicateNameErrorMessage";
  //    this.duplicateMessageParam = this.subScheduleForm.value.subScheduleName;
  //  }
    if (this.duplicateSchName && this.duplicateSchIndex) {
      this.childDuplicateMessage = "schedule.duplicateErrorMessage";

    }  else if (this.duplicateSchIndex) {
      this.childDuplicateMessage = "schedule.duplicateIndexErrorMessage";
      this.childDuplicateMessageParam = this.scheduleForm.value.scheduleIndex;

    } else if (this.duplicateSchName) {
      this.childDuplicateMessage = "schedule.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.scheduleForm.value.scheduleName;
    }
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
    if (this.accInfoForm.valid && this.selectedSchedule && this.selectedSchedule.id && this.duplicateMessage == null) {
      this.showConfirmationModal('Save');
    } else {
      this.requiredErrMsg();
    }
  }

  // delete() {
  //   this.masterService.deleteRecord(this.endPoint, this.editSubSchedule.id).subscribe(res => {
  //     this.showInformationModal("Delete");
  //   }, (error) => {
  //     this.serverErrMsg();
  //   });
  //   localStorage.removeItem('ag-activeRow');
  // }

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
    //this.loadGriddata();
    this.loadScheduleData();
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.scFormRequiredError= false;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.duplicateMessageParam = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
	this.duplicateSchIndex = false;
	this.duplicateSchName = false;
	// this.duplicateSubSchName = false;
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
    // else {
    //   title = 'Sub-Schedule';
    //   msg = 'subschedule.saveInformationMessage';
    // }
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

    // (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
    //   if (result) {
    //     if (eventType === "Delete") {
    //       this.delete();
    //     } else if (eventType === "SaveSchedule") {
    //       this.saveScheduleForm();
    //     } else {
    //       this.saveForm();
    //     }
    //   }
    // });
  }



}
