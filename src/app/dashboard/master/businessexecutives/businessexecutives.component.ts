import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-businessexecutives',
  templateUrl: './businessexecutives.component.html'
})

export class BusinessexecutivesComponent implements OnInit {

  public businessExecutiveForm: FormGroup;
  private endPoint: string = "businessexecutive/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public busiExecNum;
  private duplicateBusExecName: boolean = false;
  private duplicateBusExecNum: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  private formTitle: string = "Business Executive";
  private deleteConfirmMsg: string = "businessexecutive.deleteConfirmationMessage";
  private saveConfirmMsg: string = "businessexecutive.saveConfirmationMessage";
  private saveInfoMsg: string = "businessexecutive.saveInformationMessage";
  private deleteInfoMsg: string = "businessexecutive.deleteInformationMessage";

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.businessExecutiveForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      mobile: ['', Validators.required]
    });
    //this.loadGridData();
    this.getGridCloumsList();
    this.focusField.nativeElement.focus();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    if (this.busiExecNum != this.businessExecutiveForm.value.mobile) {
      this.duplicateBusExecNum = this.masterService.hasDataExist(this.gridDataList, 'mobile', parseInt(this.businessExecutiveForm.value.mobile));
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.formRequiredError = false;
    if (this.duplicateBusExecName && this.duplicateBusExecNum) {
      this.duplicateMessage = "businessexecutive.duplicateErrorMessage";

    } else if (this.duplicateBusExecNum) {
      this.duplicateMessage = "businessexecutive.duplicateIndexErrorMessage";
      this.duplicateMessageParam = this.businessExecutiveForm.value.mobile;

    } else if (this.duplicateBusExecName) {
      this.duplicateMessage = "businessexecutive.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.businessExecutiveForm.value.name;
    }
  }

  checkForDuplicateBusiExecName() {
    if (!this.nameFlag) {
      this.duplicateBusExecName = this.masterService.hasDataExist(this.gridDataList, 'name', this.businessExecutiveForm.value.name);
      this.getDuplicateErrorMessages();
    }
  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["BusinessExecutiveColumns"];
    });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  save() {
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
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

  resetForm() {
    this.businessExecutiveForm.reset();
    this.gridSelectedRow = null;
    this.duplicateMessage = null
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.businessExecutiveForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.deleteFlag = false;
    this.nameFlag = true;
  }

}
