import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html'
})
export class ProductGroupComponent implements OnInit {

  public productGroupForm: FormGroup;
  private endPoint: string = "productgroup/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public prodGroup;
  private duplicateProdGroup: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  private formTitle: string = "Product Group";
  private deleteConfirmMsg: string = "productgroup.deleteConfirmationMessage";
  private saveConfirmMsg: string = "productgroup.saveConfirmationMessage";
  private saveInfoMsg: string = "productgroup.saveInformationMessage";
  private deleteInfoMsg: string = "productgroup.deleteInformationMessage";

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private masterService: MasterService) {
      translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.productGroupForm = this.fb.group({
      id: [],
      productGroupName: ['', Validators.required]
    });
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
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    if (this.duplicateProdGroup) {
      this.duplicateMessage = "productgroup.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.productGroupForm.value.productGroupName;
    }
  }

  checkForDuplicateProdGroup() {
    if (!this.nameFlag) {
      this.duplicateProdGroup = this.masterService.hasDataExist(this.gridDataList, 'productGroupName', this.productGroupForm.value.productGroupName);
      this.getDuplicateErrorMessages();
    }
  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["ProductGroupColumns"];
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
    this.productGroupForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.productGroupForm.reset(s);
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.deleteFlag = false;
  }

}
