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
  public districtsForm: FormGroup;
  private endPoint: string = "accountinformation/";
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
  public scheduleList: any = [];
  public subScheduleList: any = [];
  public districtsList: any = [];
  public statesList: any = [];
  public areasList: any = [];
  public selectedSchedule: any;
  public selectedSubSchedule: any;
  public selectedDistrict: any;
  public selectedArea:any;
  public accGstType: any[];
  public accNatureOfGst: any[];
  public accCustomerType: any[];
  public accSaleType: any[];
  public accOpeningType: any[];

  private duplicateSubSchName: boolean = false;
  private duplicateDistrictName: boolean = false;

  modalRef: BsModalRef;
  message: string;

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() {

    this.accInfoForm = this.fb.group({
      id:[],
      subScheduleId:[],
      scheduleId:[],
      stateId:[],
      areaId:[],
      districtId:[],
      accountName: ['', Validators.required],
      subScheduleName: ['', Validators.required],
      scheduleName: ['', Validators.required],
      address1: ['', Validators.required],
      address2: ['', Validators.required],
      town: ['', Validators.required],
      pin: ['', Validators.required],
      stateName: ['', Validators.required],
      areaName:  ['', Validators.required],
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

    this.loadSubScheduleData();
    this.loadDistrictData();
    this.loadAreaData();
    // this.focusField.nativeElement.focus();
    this.accGstType = this.sharedDataService.getSharedCommonJsonData().GstType;
    this.accNatureOfGst = this.sharedDataService.getSharedCommonJsonData().NatureOfGst;
    this.accSaleType = this.sharedDataService.getSharedCommonJsonData().SaleType;
    this.accCustomerType = this.sharedDataService.getSharedCommonJsonData().CustomerType;
    this.accOpeningType = this.sharedDataService.getSharedCommonJsonData().OpeningType;

  }

  loadSubScheduleData() {
    this.masterService.getParentData("subschedules/").subscribe(list => {
      this.subScheduleList = list;
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

  onSelectDistrict(event) {
    this.selectedDistrict = event.item;
    this.accInfoForm.patchValue({ stateName: this.selectedDistrict.stateName });
    this.accInfoForm.patchValue({ districtId: this.selectedDistrict.id });
    this.accInfoForm.patchValue({ stateId: this.selectedDistrict.stateId });
  }

  onSelectArea(event) {
    this.selectedArea = event.item;
    this.accInfoForm.value.areaId = this.selectedArea.id;
    this.accInfoForm.patchValue({ areaId: this.selectedArea.id });
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
     const selectedScheduleNameList = _.filter(this.subScheduleList, function(o) { return o.scheduleId == temp });
     this.subScheduleForm.patchValue({ subScheduleIndex: selectedScheduleNameList.length + 1 });
  }

  openModal(template: TemplateRef<any>) {
    // this.resetsubScheduleForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
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

  resetDistrictsForm() {
    this.childDuplicateMessageParam = null;
    this.childDuplicateMessage = null;
    this.scFormServerError = this.scFormRequiredError = this.scFormSuccess = false;
    this.districtsForm.reset();
  }

  checkForDuplicateSubScheduleName() {
    this.duplicateSubSchName = this.masterService.hasDataExist(this.subScheduleList, 'subScheduleName', this.subScheduleForm.value.subScheduleName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateDistrictName() {
    this.duplicateDistrictName = this.masterService.hasDataExist(this.districtsList, 'districtName', this.districtsForm.value.districtName);
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

  }

saveForm(){
  this.accInfoForm.value.subScheduleId = this.selectedSubSchedule.id;
   this.accInfoForm.value.scheduleId = this.selectedSubSchedule.scheduleId;
   this.accInfoForm.value.areaId = this.selectedArea.id;
   this.accInfoForm.value.districtId = this.selectedDistrict.id;
   this.accInfoForm.value.stateId = this.selectedDistrict.stateId;
     console.log("this.selectedSubSchedule ", this.selectedSubSchedule, "::this.selectedArea--", this.selectedArea, ":::this.selectedDistrict--", this.selectedDistrict);
console.log("this.this.accInfoForm.value ", this.accInfoForm.value);
this.buttonsComponent.test()
this.buttonsComponent.showConfirmModal("Save", "'accountinfo.saveConfirmationMessage'", "'accountinfo.saveInformationMessage'",
  "'accountinfo.title'", this.accInfoForm, this.endPoint, "save()", "successMsg()" );

  /*if (this.accInfoForm.value.id) {
    console.log("got it");
  }else{
    this.requiredErrMsg();
  }*/
}

  save() {
    if (this.accInfoForm.value.id) {
      this.masterService.updateRecord(this.endPoint, this.accInfoForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.accInfoForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
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
    this.formRequiredError = this.formServerError = this.formSuccess = false;
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
    // this.focusField.nativeElement.focus();
  }


  showInformationModal(eventType) {
    var msg;
    var title;

   if (eventType === "SaveSubSchedule") {
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
    if (eventType === "Save") {
      title = 'Account Information';
      msg = 'accountinfo.saveConfirmationMessage';
    }

    else if(eventType === "SaveSubSchedule") {
      title = 'Sub-Schedule';
      msg = 'subSchedule.saveConfirmationMessage';
    }
    else if(eventType === "SaveDistrict") {
      title = 'Districts';
      msg = 'districts.saveConfirmationMessage';
    }

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
        //  this.saveForm();
        }
      }
    });
  }



}
