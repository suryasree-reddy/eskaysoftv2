import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule, TabsModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MasterService } from '../master.service';
import { TranslateService } from '@ngx-translate/core';
import '../../../../assets/styles/mainstyles.scss';
import * as _ from 'lodash';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-accounts-info',
  templateUrl: './accounts-info.component.html'
})

export class AccountsInfoComponent implements OnInit {
  public accInfoForm: FormGroup;
  private endPoint = 'accountinformation/';
  private taxEndPoint = 'tax/';
  public deleteFlag = true;
  public formRequiredError = false;
  public formSuccess = false;
  public duplicateMessage = null;
  public duplicateMessageParam = null;
  public nameFlag;
  public subScheduleList: any = [];
  public districtsList: any = [];
  public areasList: any = [];
  public selectedSubSchedule: any;
  public selectedDistrict: any;
  public selectedArea: any;
  public accGstType: any[];
  public accNatureOfGst: any[];
  public accCustomerType: any[];
  public accSaleType: any[];
  public accOpeningType: any[];
  @Input() gridDataList: any = [];
  public typeaheadTaxDataList: any = [];
  private duplicateAcctShortName = false;
  private duplicateAcctName = false;
  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  @Input() isModelWindowView = false;
  @Input() bodyStyle = 'col-xs-5';
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();

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
    this.focusField.nativeElement.focus();
  }

  loadTaxTypeaheadData() {
    this.masterService.getParentData(this.taxEndPoint).subscribe(list => {
      this.typeaheadTaxDataList = list;
    });
  }

  loadSubScheduleData() {
    this.masterService.getParentData('subschedules/').subscribe(list => {
      this.subScheduleList = list;
    });
  }

  loadDistrictData() {
    this.masterService.getParentData('districts/').subscribe(list => {
      this.districtsList = list;
    });
  }

  loadAreaData() {
    this.masterService.getParentData('area/').subscribe(list => {
      this.areasList = list;
    });
  }

  loadSelectedTaxTypeahead(event) {
    this.accInfoForm.patchValue({ taxId: event.item.id });
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
    this.accInfoForm.patchValue({ businessExecutiveName: this.selectedArea.businessExecutiveName });
    this.accInfoForm.patchValue({ businessExecutiveId: this.selectedArea.businessExecutiveId });
  }

  onSelectSubSchedule(event) {
    this.selectedSubSchedule = event.item;
    this.accInfoForm.patchValue({ subScheduleId: this.selectedSubSchedule.id });
    this.accInfoForm.patchValue({ scheduleId: this.selectedSubSchedule.scheduleId });
    this.accInfoForm.patchValue({ scheduleName: this.selectedSubSchedule.scheduleName });
    const temp = this.selectedSubSchedule.id;
    const selectedSubScheduleNameList = _.filter(this.subScheduleList, function(o) { return o.subScheduleId === temp; });
    this.accInfoForm.patchValue({ subScheduleIndex: selectedSubScheduleNameList });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
    });
  }

  loadSelectedTypeahead(event) {
    this.accInfoForm.reset(event.item);
    this.nameFlag = true;
    this.deleteFlag = !event.item.deleteFlag;
  }

  openModal(template: TemplateRef<any>, templateName) {
      this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  checkForDuplicateAcctName() {
    this.duplicateAcctName = this.masterService.hasDataExist(this.gridDataList, 'accountName', this.accInfoForm.value.accountName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateAcctShortName() {
    this.duplicateAcctShortName = this.masterService.hasDataExist(this.gridDataList, 'shortName', this.accInfoForm.value.shortName);
    this.getDuplicateErrorMessages();
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateAcctShortName || !this.duplicateAcctShortName) {
      this.duplicateMessageParam = null;
      this.duplicateMessage = null;
      this.formRequiredError = false;
    }
    if (this.duplicateAcctShortName && this.duplicateAcctName) {
      this.duplicateMessage = 'accountinfo.duplicateErrorMessage';

    } else if (this.duplicateAcctName) {
      this.duplicateMessage = 'accountinfo.duplicateNameErrorMessage';
      this.duplicateMessageParam = this.accInfoForm.value.accountName;

    } else if (this.duplicateAcctShortName) {
      this.duplicateMessage = 'accountinfo.duplicateShortNameErrorMessage';
      this.duplicateMessageParam = this.accInfoForm.value.shortName;
    }
  }

  save() {
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    if (this.modalRef !== undefined && this.modalRef !== null) {
      this.modalRef.hide();
      this.modalService.hide(1);
      this.modalRef = null;
      this.loadAreaData();
      this.loadSubScheduleData();
      this.loadDistrictData();
    } else {
      if (this.isModelWindowView) {
        this.callbackOnModelWindowClose.emit();
      } else {
        this.formSuccess = true;
        this.formRequiredError = false;
        this.resetForm();
      }
    }
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.formRequiredError = this.formSuccess = false;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.duplicateAcctShortName = false;
    this.duplicateAcctShortName = false;
    this.accInfoForm.reset();
    if (!this.isModelWindowView) {
        this.loadGridData();
    }
  }

}
