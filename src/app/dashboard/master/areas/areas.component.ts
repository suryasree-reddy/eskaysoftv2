import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-areas',
  templateUrl: './areas.component.html'
})

export class AreasComponent implements OnInit {

  public areaForm: FormGroup;
  public businessExecutiveForm: FormGroup;
  private areaEndPoint: string = "area/";
  private beEndPoint: string = "businessexecutive/";
  public gridDataList: any = [];
  public typeaheadDataList: any = [];
  public gridSelectedRow;
  public selectedTypeahead: any;
  public deleteFlag: boolean = true;
  public formRequiredError: boolean = false;
  public formSuccess: boolean = false;
  public scFormRequiredError: boolean = false;
  public scFormSuccess: boolean = false;
  public nameFlag;
  public areaName;
  private duplicateAreaName: boolean = false;
  private duplicateBusExecName: boolean = false;
  private duplicateBusExecNum: boolean = false;
  public duplicateMessage: string = null;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) { translate.setDefaultLang('messages.en'); }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }
  ngOnInit() {
    this.areaForm = this.fb.group({
      id: [],
      areaName: ['', Validators.required],
      businessExecutiveId: [],
      businessExecutiveName: []
    });

    this.businessExecutiveForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      mobile: ['', Validators.required]
    });

    this.loadTypeaheadData();
    //this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  loadTypeaheadData() {
    this.masterService.getParentData(this.beEndPoint).subscribe(list => {
      this.typeaheadDataList = list;
    });
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    if (!this.nameFlag) {
      this.duplicateAreaName = this.masterService.hasDataExist(this.gridDataList, 'areaName', this.areaForm.value.areaName);
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateBusExecName || !this.duplicateBusExecNum) {
      this.childDuplicateMessage = null;
      this.childDuplicateMessageParam = null;
      this.scFormRequiredError = false;
    }
    if (!this.duplicateAreaName) {
      this.duplicateMessageParam = null;
      this.duplicateMessage = null;
      this.formRequiredError = false;
    }

    if (this.duplicateAreaName) {
      this.duplicateMessage = "areas.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.areaForm.value.areaName;
      this.formRequiredError = false;
    }
    console.log(this.duplicateBusExecName, this.duplicateBusExecNum);
    if (this.duplicateBusExecName && this.duplicateBusExecNum) {
      this.childDuplicateMessage = "businessexecutive.duplicateErrorMessage";
    }
    else if (this.duplicateBusExecName) {
      this.childDuplicateMessage = "businessexecutive.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.businessExecutiveForm.value.name;
    }
    else if (this.duplicateBusExecNum) {
      this.childDuplicateMessage = "businessexecutive.duplicateIndexErrorMessage";
      this.childDuplicateMessageParam = this.businessExecutiveForm.value.mobile;
    }
  }

  checkForDuplicatePhone() {
    this.duplicateBusExecNum = this.masterService.hasDataExist(this.typeaheadDataList, 'mobile', parseInt(this.businessExecutiveForm.value.mobile));
    this.getDuplicateErrorMessages();

  }

  checkForDuplicateBusiExecName() {
    this.duplicateBusExecName = this.masterService.hasDataExist(this.typeaheadDataList, 'name', this.businessExecutiveForm.value.name);
    this.getDuplicateErrorMessages();
  }

  loadGridData() {
    this.masterService.getData(this.areaEndPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      this.gridDataList = this.masterService.mergeObjects(list, this.typeaheadDataList, 'businessExecutiveId', 'id');
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    })
  }

  loadSelectedTypeahead(event) {
    this.selectedTypeahead = event.item;
  }

  openModal(template: TemplateRef<any>) {
    this.resetBusinessExecutiveForm();
    this.scFormRequiredError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  saveBusinessExecutive() {
    if (this.businessExecutiveForm.valid) {
      this.showConfirmationModal();
    } else {
      this.scRequiredErrMsg();
    }
  }

  save_BusinessExecutive() {

    this.masterService.createRecord(this.beEndPoint, this.businessExecutiveForm.value).subscribe(res => {
      this.showInformationModal();
      this.loadTypeaheadData();
      this.modalRef.hide();
      this.businessExecutiveForm.reset();
    }, (error) => {
      throw error;
    });
  }

  save() {
    this.areaForm.value.businessExecutiveId = this.selectedTypeahead.id;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    if (this.modalRef != undefined) {
      this.modalRef.hide();
      this.loadTypeaheadData();
      this.businessExecutiveForm.reset();
    } else {
      this.formSuccess = true;
      this.formRequiredError = false;
      this.resetForm();
    }
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  scRequiredErrMsg() {
    this.scFormRequiredError = true;
    this.scFormSuccess = false;
  }

  resetForm() {
    this.businessExecutiveForm.reset();
    this.areaForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.areaForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.nameFlag = true;
    this.deleteFlag = false;
  }

  resetBusinessExecutiveForm() {
    this.scFormRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.businessExecutiveForm.reset();
  }

  showInformationModal() {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      "Business Executive", "businessexecutive.saveInformationMessage", '');
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe();
  }

  showConfirmationModal(): void {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      "Business Executive", "businessexecutive.saveConfirmationMessage", 'green', '');
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.save_BusinessExecutive();
      }
    });
  }

}
