import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

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
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public scFormRequiredError: boolean = false;
  public scFormServerError: boolean = false;
  public scFormSuccess: boolean = false;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  private duplicateProdGroup: boolean = false;
  private duplicateProdCategory: boolean = false;
  private duplicateCompany: boolean = false;
  public typeaheadGroupDataList: any = [];
  public typeaheadCompanyDataList: any = [];
  public typeaheadCategoryDataList: any = [];
  public selectedCategoryTypeahead: any;
  public selectedGroupTypeahead: any;
  public selectedCompanyTypeahead: any;

  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder, 
    private translate: TranslateService,
    private modalService: BsModalService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      companyId:[],
      productGroupId: [],
      productCategoryId: [],
      name: ['', Validators.required],
      packing: ['', Validators.required],
      boxQty: ['', Validators.required],
      productGroupName: ['', Validators.required],
      companyCode: ['', Validators.required],
      caseQty: ['', Validators.required],
      productCategoryName: ['', Validators.required],
      netRate: ['', Validators.required],
      isNetRateItem: ['', Validators.required],
      schemeQty: ['', Validators.required],
      free: ['', Validators.required],
      contents: ['', Validators.required],
      tax: ['', Validators.required],
      code: ['', Validators.required]
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
      companyId: [],
      companyCode: ['', Validators.required]
    });
    
    //this.loadGridData();
    this.getGridCloumsList();
    this.loadGroupTypeaheadData();
    this.loadCategoryTypeaheadData();
    this.loadCompanyTypeaheadData();
    this.getJsonData();
    // this.focusField.nativeElement.focus();
  }

  getJsonData() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["ProductColumns"];
    });
  }

loadCompanyTypeaheadData(){
  this.masterService.getParentData(this.cEndPoint).subscribe(list => {
    this.typeaheadCompanyDataList = list;
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
    this.productForm.patchValue({ productGroupId: event.item.id });
  }

  loadSelectedCompanyTypeahead(event) {
    this.selectedCompanyTypeahead = event.item;
    this.productForm.patchValue({ companyId: event.item.id });
  }

  loadSelectedCategoryTypeahead(event) {
    this.selectedCategoryTypeahead = event.item;
    this.productForm.patchValue({ productCategoryId: event.item.productCategoryId });
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  openModal(template: TemplateRef<any>) {
    this.resetChildForm();
    this.scFormRequiredError = this.scFormServerError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.formRequiredError = false;
    this.duplicateMessageParam = null;
    this.scFormRequiredError = false;

      if (this.duplicateProdGroup) {
      this.childDuplicateMessage = "productgroup.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.productGroupForm.value.productGroupName;
    }
    else if (this.duplicateProdCategory) {
      this.childDuplicateMessage = "productcategory.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.productCategoryForm.value.productCategoryName;
    }
    else if (this.duplicateCompany) {
      this.childDuplicateMessage = "companies.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.companyForm.value.companyCode;
    }
  }

  checkForDuplicateProdGroup() {
    if (!this.nameFlag) {
      this.duplicateProdGroup = this.masterService.hasDataExist(this.typeaheadGroupDataList, 'productGroupName', this.productGroupForm.value.productGroupName);
      this.getDuplicateErrorMessages();
    }
  }

  checkForDuplicateProdCategory() {
    if (!this.nameFlag) {
      this.duplicateProdCategory = this.masterService.hasDataExist(this.typeaheadCategoryDataList, 'productCategoryName', this.productCategoryForm.value.productCategoryName);
      this.getDuplicateErrorMessages();
    }
  }

  checkForDuplicateCompanyCode() {
    this.duplicateCompany = this.masterService.hasDataExist(this.gridDataList, 'companyCode', this.companyForm.value.companyCode);
    this.getDuplicateErrorMessages();
}

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["ProductColumns"];
    });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  saveForm() {
    this.formRequiredError = false;
    if (this.productForm.valid && this.duplicateMessage == null) {
      this.showConfirmationModal("Save");
    } else {
      this.requiredErrMsg()
    }
  }

  save() {
    if (this.productForm.value.id) {
      this.masterService.updateRecord(this.endPoint, this.productForm.value).subscribe(res => {
        this.successMsg();
      }, (error) => {
        this.serverErrMsg();
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.productForm.value).subscribe(res => {
        this.successMsg();
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  
  saveChildForm() {
    this.scFormRequiredError = false;
    if (this.productGroupForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveChildForm");
    } else {
      this.scRequiredErrMsg()
    }
  }

  saveChildData() {
    this.masterService.createRecord(this.pgEndPoint, this.productGroupForm.value).subscribe(res => {
      this.showInformationModal("SaveChildForm");

    }, (error) => {
      this.serverErrMsg();
    });

  }

  saveChildPCForm() {
    this.scFormRequiredError = false;
    if (this.productCategoryForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveChildPCForm");
    } else {
      this.scRequiredErrMsg()
    }
  }

  saveChildPCData() {
    this.masterService.createRecord(this.pcEndPoint, this.productCategoryForm.value).subscribe(res => {
      this.showInformationModal("SaveChildPCForm");

    }, (error) => {
      this.serverErrMsg();
    });

  }

  saveChildCmpForm() {
    this.scFormRequiredError = false;
    if (this.companyForm.valid && this.childDuplicateMessage == null) {
      this.showConfirmationModal("SaveChildCmpForm");
    } else {
      this.scRequiredErrMsg()
    }
  }

  saveChildCmpData() {
    this.masterService.createRecord(this.cEndPoint, this.companyForm.value).subscribe(res => {
      this.showInformationModal("SaveChildCmpForm");

    }, (error) => {
      this.serverErrMsg();
    });

  }

  delete() {
    if (confirm('Are you sure!!')) {
      this.masterService.deleteRecord(this.endPoint, this.gridSelectedRow.id).subscribe(res => {
        localStorage.removeItem('ag-activeRow');
        this.successMsg()
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
    this.resetChildForm();
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
    this.productForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.productForm.reset(s);
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.deleteFlag = false;
  }

  resetChildForm() {
    this.scFormRequiredError = false;
    this.scFormServerError = false;
    this.duplicateMessage = null;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.formRequiredError = false;
    this.duplicateMessageParam = null;
    this.productGroupForm.reset();
    this.productCategoryForm.reset();
    this.companyForm.reset();
  }

  scRequiredErrMsg() {
    this.scFormRequiredError = true;
    this.scFormSuccess = this.scFormServerError = false;
  }

  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'product.deleteInformationMessage';
      title = 'Product';
    } else if (eventType === "Save") {
      title = 'Product';
      msg = 'product.saveInformationMessage';
    }
    else if (eventType === "SaveChildForm") {
      title = 'Product Group';
      msg = 'productgroup.saveInformationMessage';
    }
    else if (eventType === "SaveChildPCForm") {
      title = 'Product Category';
      msg = 'productcategory.saveInformationMessage';

    }
    else if (eventType === "SaveChildCmpForm") {
      title = 'Company';
      msg = 'companies.saveInformationMessage';

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
    if (eventType === "Delete") {
      title = 'Product';
      msg = 'product.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'Product';
      msg = 'product.saveConfirmationMessage';
    }
    else if (eventType === "SaveChildForm") {
      title = 'Product Group';
      msg = 'productgroup.saveConfirmationMessage';
    }
    else if (eventType === "SaveChildPCForm") {
      title = 'Product Category';
      msg = 'productcategory.saveConfirmationMessage';
    }
    else if (eventType === "SaveChildCmpForm") {
      title = 'Company';
      msg = 'companies.saveConfirmationMessage';
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
        if (eventType === "Delete") {
          this.delete();
        } else if (eventType === "SaveChildForm") {
          this.saveChildData();
        }
        else if (eventType === "SaveChildPCForm") {
          this.saveChildPCData();
        }
        else if (eventType === "SaveChildCmpForm") {
          this.saveChildPCData();
        }
        else {
          this.save();
        }
      }
    });
  }

}
