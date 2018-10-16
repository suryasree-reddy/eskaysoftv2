import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html'
})
export class ManufacturerComponent implements OnInit {

  public manufacturerForm: FormGroup;
  private endPoint: string = "manfacturer/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public manufName;
  private duplicateManufName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  private formTitle: string = "Manufacturer";
  private deleteConfirmMsg: string = "manufacturer.deleteConfirmationMessage";
  private saveConfirmMsg: string = "manufacturer.saveConfirmationMessage";
  private saveInfoMsg: string = "manufacturer.saveInformationMessage";
  private deleteInfoMsg: string = "manufacturer.deleteInformationMessage";

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.manufacturerForm = this.fb.group({
      id: [],
      manfacturerName: ['', Validators.required]
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
    if (this.duplicateManufName) {
      this.duplicateMessage = "manufacturer.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.manufacturerForm.value.manfacturerName;
    }
  }

  checkForDuplicateManufName() {
    if (!this.nameFlag) {
      this.duplicateManufName = this.masterService.hasDataExist(this.gridDataList, 'manfacturerName', this.manufacturerForm.value.manfacturerName);
      this.getDuplicateErrorMessages();
    }
  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["ManfacturerColumns"];
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
    this.manufacturerForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.manufacturerForm.reset(s);
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.deleteFlag = false;
  }

}
