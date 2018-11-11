import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  public productForm: FormGroup;
  // public productGroupName: FormGroup;
  public productGroupForm: FormGroup;
  public productCategoryForm: FormGroup;
  public companyForm: FormGroup;
  private endPoint: string = "product/";
  private pgEndPoint: string = "productgroup/";
  private pcEndPoint: string = "productcategory/";
  private cEndPoint: string = "company/";
  private cgEndPoint: string = "companygroup/";
  private taxEndPoint: string = "tax/";
  public gridDataList: any = [];
  public companyTypeList: any = [];
  public companyStatusList: any = [];
  public typeaheadDataList: any = [];
  public invGenList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public nameFlag;
  // public deleteFlag: boolean = true;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public scFormRequiredError: boolean = false;
  public scFormSuccess: boolean = false;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  private duplicateProdGroup: boolean = false;
  private duplicateProdCategory: boolean = false;
  private duplicateCompany: boolean = false;
  private duplicateCompanyName: boolean = false;
  private duplicateProductCode: boolean = false;
  private duplicateProductName: boolean = false;
  public typeaheadGroupDataList: any = [];
  public typeaheadCompanyDataList: any = [];
  public typeaheadCompanyGroupDataList: any = [];
  public typeaheadTaxDataList: any = [];
  public typeaheadCategoryDataList: any = [];
  public selectedCategoryTypeahead: any;
  public selectedTaxTypeahead: any;
  public selectedGroupTypeahead: any;
  public selectedCompanyTypeahead: any;

  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      taxId: [],
      companyId: [],
      productgroupId: [],
      productcategoryId: [],
      name: ['', Validators.required],
      packing: ['', Validators.required],
      boxQty: ['', Validators.required],
      productGroupName: ['', Validators.required],
      companyName: ['', Validators.required],
      caseQty: ['', Validators.required],
      productCategoryName: ['', Validators.required],
      netRate: ['', Validators.required],
      isNetRateItem: ['', Validators.required],
      schemeQty: ['', Validators.required],
      free: ['', Validators.required],
      contents: ['', Validators.required],
      tax: ['', Validators.required],
      productcode: ['', Validators.required]
    });

    this.productGroupForm = this.fb.group({
      id: [],
      productGroupName: ['', Validators.required]
    });

    this.productCategoryForm = this.fb.group({
      id: [],
      productCategoryName: ['', Validators.required]
    });

    this.companyForm = this.fb.group({
      id: [],
      companyGroupId: [],
      companyCode: ['', Validators.required],
      companyName: ['', Validators.required],
      companyGroupName: ['', Validators.required],
      companyType: ['', Validators.required],
      companyStatus: ['', Validators.required],
      invGenType: ['', Validators.required],
      invPrefix: ['', Validators.required]
    });

    this.loadGroupTypeaheadData();
    this.loadCategoryTypeaheadData();
    this.loadCompanyTypeaheadData();
    this.loadCompanyGroupTypeaheadData();
    this.loadTaxTypeaheadData();
    this.companyTypeList = this.sharedDataService.getSharedCommonJsonData().CompanyType;
    this.companyStatusList = this.sharedDataService.getSharedCommonJsonData().CompanyStatus;
    this.invGenList = this.sharedDataService.getSharedCommonJsonData().InvGenType;
  }

  loadCompanyGroupTypeaheadData() {
    this.masterService.getParentData(this.cgEndPoint).subscribe(list => {
      this.typeaheadCompanyGroupDataList = list;
    });
  }

  loadCompanyTypeaheadData() {
    this.masterService.getParentData(this.cEndPoint).subscribe(list => {
      this.typeaheadCompanyDataList = list;
    });
  }

  loadTaxTypeaheadData() {
    this.masterService.getParentData(this.taxEndPoint).subscribe(list => {
      this.typeaheadTaxDataList = list;
    });
  }

  loadGroupTypeaheadData() {
    this.masterService.getParentData(this.pgEndPoint).subscribe(list => {
      this.typeaheadGroupDataList = list;
    });
  }

  loadCategoryTypeaheadData() {
    this.masterService.getParentData(this.pcEndPoint).subscribe(list => {
      this.typeaheadCategoryDataList = list;
    });
  }

  loadSelectedGroupTypeahead(event) {
    this.selectedGroupTypeahead = event.item;
    this.productForm.patchValue({ productgroupId: event.item.id });
  }

  loadSelectedCompanyGroupTypeahead(event) {
    this.companyForm.patchValue({ companyGroupId: event.item.id });
  }

  loadSelectedCompanyTypeahead(event) {
    this.selectedCompanyTypeahead = event.item;
    this.productForm.patchValue({ companyId: event.item.id });
  }

  loadSelectedCategoryTypeahead(event) {
    this.selectedCategoryTypeahead = event.item;
    this.productForm.patchValue({ productcategoryId: event.item.id });
  }

  loadSelectedTaxTypeahead(event) {
    this.selectedTaxTypeahead = event.item;
    this.productForm.patchValue({ taxId: event.item.id });
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  openModal(template: TemplateRef<any>) {
    this.resetChildForm();
    this.scFormRequiredError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  getDuplicateErrorMessages(): void {

    if (!this.duplicateProdGroup || !this.duplicateProdCategory || !this.duplicateCompany || !this.duplicateCompanyName) {
      this.childDuplicateMessage = null;
      this.childDuplicateMessageParam = null;
      this.scFormRequiredError = false;
    }

    if (!this.duplicateProductCode || !this.duplicateProductName) {
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
      this.formRequiredError = false;
    }

    if (this.duplicateProductCode && this.duplicateProductName) {
      this.duplicateMessage = "product.duplicateErrorMessage";
    }
    else if (this.duplicateProductCode) {
      this.duplicateMessage = "product.duplicateCodeErrorMessage";
      this.duplicateMessageParam = this.productForm.value.productcode;
    }
    else if (this.duplicateProductName) {
      this.duplicateMessage = "product.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.productForm.value.name;
    }

    if (this.duplicateProdGroup) {
      this.childDuplicateMessage = "productgroup.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.productGroupForm.value.productGroupName;
    }

    if (this.duplicateProdCategory) {
      this.childDuplicateMessage = "productcategory.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.productCategoryForm.value.productCategoryName;
    }

    if (this.duplicateCompany && this.duplicateCompanyName) {
      this.childDuplicateMessage = "companies.duplicateErrorMessage";
    }
    else if (this.duplicateCompany) {
      this.childDuplicateMessage = "companies.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.companyForm.value.companyCode;
    }
    else if (this.duplicateCompanyName) {
      this.childDuplicateMessage = "companies.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.companyForm.value.companyName;
    }
  }

  checkForDuplicateProdGroup() {
    this.duplicateProdGroup = this.masterService.hasDataExist(this.typeaheadGroupDataList, 'productGroupName', this.productGroupForm.value.productGroupName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateProdCategory() {
    this.duplicateProdCategory = this.masterService.hasDataExist(this.typeaheadCategoryDataList, 'productCategoryName', this.productCategoryForm.value.productCategoryName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateCompanyCode() {
    this.duplicateCompany = this.masterService.hasDataExist(this.typeaheadCompanyDataList, 'companyCode', this.companyForm.value.companyCode);
    if (this.duplicateCompany) {
      const temp = this.companyForm.value.companyCode;
      const companyObj = _.filter(this.typeaheadCompanyDataList, function(o) { return o.companyCode.toLowerCase() == temp.toLowerCase() });
      this.companyForm.patchValue({ companyCode: companyObj[0].companyCode })
    }
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateCompanyName() {
    this.duplicateCompanyName = this.masterService.hasDataExist(this.typeaheadCompanyDataList, 'companyName', this.companyForm.value.companyName);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateProductName() {
    if (!this.nameFlag) {
      this.duplicateProductName = this.masterService.hasDataExist(this.gridDataList, 'name', this.productForm.value.name);
      this.getDuplicateErrorMessages();
    }
  }

  checkForDuplicateProductCode() {
    if (!this.nameFlag) {
      this.duplicateProductCode = this.masterService.hasDataExist(this.gridDataList, 'productcode', this.productForm.value.productcode);
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
    if (this.productForm.value.id) {
      this.masterService.updateRecord(this.endPoint, this.productForm.value).subscribe(res => {
        this.showInformationModal("Save");
        this.successMsg();
      }, (error) => {
        throw error;
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.productForm.value).subscribe(res => {
        this.showInformationModal("Save");
        this.successMsg();
      }, (error) => {
        throw error;
      });
    }
  }

  saveChildForm(screenName, formObj) {
    this.scFormRequiredError = false;
    if (formObj.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal(screenName);
    } else {
      this.scRequiredErrMsg()
    }
  }

  saveChild(screenName, formObj, targetUrl) {
    this.masterService.createRecord(targetUrl, formObj.value).subscribe(res => {
      this.showInformationModal(screenName);
      if (screenName == "PC") {
        this.loadCategoryTypeaheadData();
      } else if (screenName == "PG") {
        this.loadGroupTypeaheadData();
      } else if (screenName == "Company") {
        this.loadCompanyTypeaheadData();
      }
      this.modalRef.hide();
      formObj.reset();
    }, (error) => {
      throw error;
    });
  }


  delete() {
    this.masterService.deleteRecord(this.endPoint, this.gridSelectedRow.id).subscribe(res => {
      localStorage.removeItem('ag-activeRow');
      this.successMsg()
    }, (error) => {
      throw error;
    });
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    this.resetForm();
    this.resetChildForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.formRequiredError = false;
    this.duplicateMessageParam = null;
    this.duplicateMessage = null;
    this.productForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    // this.deleteFlag = true;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
    this.loadTaxTypeaheadData();
    this.duplicateProductCode = false;
    this.duplicateProductName = false;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.productForm.reset(s);
    //  this.companyForm.reset(s);
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    // this.deleteFlag = !this.gridSelectedRow.deleteFlag;
  }

  resetChildForm() {
    this.scFormRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.duplicateProdGroup = false;
    this.duplicateProdCategory = false;
    this.duplicateCompany = false;
    this.duplicateCompanyName = false;
    this.productGroupForm.reset();
    this.productCategoryForm.reset();
    this.duplicateProdGroup= false;
    this.duplicateProdCategory= false;
    this.duplicateCompany = false;
    this.duplicateCompanyName = false;
    this.companyForm.reset();
  }

  scRequiredErrMsg() {
    if (this.childDuplicateMessage == null) {
      this.scFormRequiredError = true;
      this.scFormSuccess = false;
    }
  }

  showInformationModal(eventType) {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      this.getFormDetails(eventType).title,
      this.getFormDetails(eventType).infoMessage, ''
    );
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe();
  }

  showConfirmationModal(eventType): void {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      this.getFormDetails(eventType).title,
      this.getFormDetails(eventType).confirmMessage,
      'green', ''
    );

    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        if (eventType == "Delete") {
          this.delete();
        } else if (eventType == "PG") {
          this.saveChild("PG", this.productGroupForm, this.pgEndPoint);
        }
        else if (eventType == "PC") {
          this.saveChild("PC", this.productCategoryForm, this.pcEndPoint);
        }
        else if (eventType == "Company") {
          this.saveChild("Company", this.companyForm, this.cEndPoint);
        }
        else {
          this.save();
        }
      }
    });
  }

  getFormDetails(screenName) {

    if (screenName == "Delete") {
      return { "title": "Product", "confirmMessage": "product.deleteConfirmationMessage", "infoMessage": "product.deleteInformationMessage" };
    } else if (screenName == "Save") {
      return { "title": "Product", "confirmMessage": "product.saveConfirmationMessage", "infoMessage": "product.saveInformationMessage" };
    }
    else if (screenName == "PG") {
      return { "title": "Product Group", "confirmMessage": "productgroup.saveConfirmationMessage", "infoMessage": "productgroup.saveInformationMessage" };
    }
    else if (screenName == "PC") {
      return { "title": "Product Category", "confirmMessage": "productcategory.saveConfirmationMessage", "infoMessage": "productcategory.saveInformationMessage" };
    }
    else if (screenName == "Company") {
      return { "title": "Company", "confirmMessage": "companies.saveConfirmationMessage", "infoMessage": "companies.saveInformationMessage" };
    }

  }



}
