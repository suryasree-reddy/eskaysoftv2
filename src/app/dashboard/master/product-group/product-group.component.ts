import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';


@Component({
  selector: 'app-product-group',
  templateUrl: './product-group.component.html'
})
export class ProductGroupComponent implements OnInit {

  public productGroupForm: FormGroup;
  private endPoint: string = "productgroup/";
  public gridDataList: any = [];
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
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
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.productGroupForm = this.fb.group({
      id: [],
      productGroupName: ['', Validators.required]
    });
    this.focusField.nativeElement.focus();
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateProdGroup) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }

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
    this.formRequiredError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.productGroupForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateProdGroup = false;
    this.duplicateMessageParam = null;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.productGroupForm.reset(s);
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.deleteFlag = !this.gridSelectedRow.deleteFlag;
  }

}
