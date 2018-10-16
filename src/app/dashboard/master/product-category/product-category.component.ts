import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html'
})
export class ProductCategoryComponent implements OnInit {

  public productCategoryForm: FormGroup;
  private endPoint: string = "productcategory/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public prodCategory;
  private duplicateProdCategory: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;
  private formTitle: string = "Product Category";
  private deleteConfirmMsg: string = "productcategory.deleteConfirmationMessage";
  private saveConfirmMsg: string = "productcategory.saveConfirmationMessage";
  private saveInfoMsg: string = "productcategory.saveInformationMessage";
  private deleteInfoMsg: string = "productcategory.deleteInformationMessage";

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private masterService: MasterService) {
      translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.productCategoryForm = this.fb.group({
      productCategoryId: [],
      productCategoryName: ['', Validators.required]
    });
    //  this.loadGridData();
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
    if (this.duplicateProdCategory) {
      this.duplicateMessage = "productcategory.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.productCategoryForm.value.productCategoryName;
    }
  }

  checkForDuplicateProdCategory() {
    if (!this.nameFlag) {
      this.duplicateProdCategory = this.masterService.hasDataExist(this.gridDataList, 'productCategoryName', this.productCategoryForm.value.productCategoryName);
      this.getDuplicateErrorMessages();
    }

  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["ProductCategoryColumns"];
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
    this.masterService.deleteRecord(this.endPoint, this.gridSelectedRow.productCategoryId).subscribe(res => {
      localStorage.removeItem('ag-activeRow');
      this.buttonsComponent.showInformationModal("Delete");
    }, (error) => {
      this.serverErrMsg();
    });
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
    this.productCategoryForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.productCategoryForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
    this.deleteFlag = false;
  }


}
