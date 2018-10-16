import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';


@Component({
  selector: 'app-bankinformation',
  templateUrl: './bankinformation.component.html'
})
export class BankinformationComponent implements OnInit {

  public bankInformationForm: FormGroup;
  private endPoint: string = "bankinformation/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public bankName;
  private duplicateBankName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  private formTitle: string = "Bank Information";
  private deleteConfirmMsg: string = "bankinfo.deleteConfirmationMessage";
  private saveConfirmMsg: string = "bankinfo.saveConfirmationMessage";
  private saveInfoMsg: string = "bankinfo.saveInformationMessage";
  private deleteInfoMsg: string = "bankinfo.deleteInformationMessage";

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.bankInformationForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    //this.loadGridData();
    this.getGridCloumsList();
    this.focusField.nativeElement.focus();
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.formRequiredError = false;
    if (this.duplicateBankName) {
      this.duplicateMessage = "bankinfo.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.bankInformationForm.value.name;
    }
  }

  checkForDuplicateBankName() {
    if (!this.nameFlag) {
      this.duplicateBankName = this.masterService.hasDataExist(this.gridDataList, 'name', this.bankInformationForm.value.name);
      this.getDuplicateErrorMessages();
    }
  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["BankInformationColumns"];
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
    this.bankInformationForm.reset();
    this.gridSelectedRow = null;
    this.duplicateMessage = null;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.deleteFlag = true;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.bankInformationForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
    this.deleteFlag = false;
  }

}
