import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-customerwise-discount',
  templateUrl: './customerwise-discount.component.html',
})
export class CustomerwiseDiscountComponent implements OnInit {

  public customerDiscountForm: FormGroup;
  public companyForm: FormGroup;
  private endPoint: string = "customerwisediscount/";
  private cEndPoint: string = "company/";
  private cgEndPoint: string = "companygroup/";
  private aiEndPoint: string = "accountinformation/";
  public gridDataList: any = [];
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public customerName;
  public companyCode;
  public companyTypeList: any = [];
  public companyStatusList: any = [];
  public typeaheadCompanyGroupDataList: any = [];
  public invGenList: any = [];
  private validCompanyName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public scFormRequiredError: boolean = false;
  public scFormSuccess: boolean = false;
  public childDuplicateMessage: string = null;
  public childDuplicateMessageParam: string = null;
  private duplicateCompany: boolean = false;
  private duplicateCompanyName: boolean = false;
  public typeaheadCompanyDataList: any = [];
  public typeaheadCustomerDataList: any = [];
  public selectedCompanyTypeahead: any;
  public selectedCustomerTypeahead: any;
  private discountType: boolean = false;
  modalRef: BsModalRef;
  message: string;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.customerDiscountForm = this.fb.group({
      id: [],
      accountInformationId: [],
      companyId: [],
      companyName: [],
      accountName: ['', Validators.required],
      disc: ['', Validators.required],
      discountType: []
    });

    this.companyForm = this.fb.group({
      id: [],
      companyGroupId: [],
      companyCode: ['', Validators.required],
      companyName: ['', Validators.required],
      companyType: ['', Validators.required],
      companyGroupName: ['', Validators.required],
      companyStatus: ['', Validators.required],
      invGenType: ['', Validators.required],
      invPrefix: ['', Validators.required]
    });
    this.loadCompanyTypeaheadData();
    this.loadCustomerTypeaheadData();
    this.companyTypeList = this.sharedDataService.getSharedCommonJsonData().CompanyType;
    this.companyStatusList = this.sharedDataService.getSharedCommonJsonData().CompanyStatus;
    this.invGenList = this.sharedDataService.getSharedCommonJsonData().InvGenType;
  }

  loadCustomerTypeaheadData() {
    this.masterService.getParentData(this.aiEndPoint).subscribe(list => {
      this.typeaheadCustomerDataList = list;
    });
  }

  loadCompanyTypeaheadData() {
    this.masterService.getParentData(this.cEndPoint).subscribe(list => {
      this.typeaheadCompanyDataList = list;
      //  this.retrieveCompaniesByAccount(this.gridDataList);
    });
  }

  loadCompanyGroupTypeaheadData() {
    this.masterService.getParentData(this.cgEndPoint).subscribe(list => {
      this.typeaheadCompanyGroupDataList = list;
    });
  }

  loadSelectedCompanyGroupData(event) {
    this.companyForm.patchValue({ companyGroupId: event.item.id });
  }

  loadSelectedCustomerTypeahead(event) {
    this.selectedCustomerTypeahead = event.item;
    this.customerDiscountForm.patchValue({ discountType: false });
    this.customerDiscountForm.patchValue({ accountInformationId: this.selectedCustomerTypeahead.id });
    this.loadGridDataById();
  }

  loadGridDataById() {
    this.masterService.getData("customerwisediscount/accountinfo/" + parseInt(this.selectedCustomerTypeahead.id));
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  loadSelectedCompanyTypeahead(event) {
    this.validCompanyName = this.masterService.hasDataExist(this.gridDataList, 'companyId', parseInt(event.item.id));
    if (!this.validCompanyName) {
      this.selectedCompanyTypeahead = event.item;
      this.customerDiscountForm.patchValue({ companyId: event.item.id });
    }
    this.getDuplicateErrorMessages();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  openModal(template: TemplateRef<any>) {
    this.resetChildForm();
    this.loadCompanyGroupTypeaheadData();
    this.scFormRequiredError = this.scFormSuccess = false;
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  getDuplicateErrorMessages(): void {

    if (!this.duplicateCompany || !this.duplicateCompanyName) {
      this.childDuplicateMessage = null;
      this.childDuplicateMessageParam = null;
      this.scFormRequiredError = false;
    }

    if (!this.validCompanyName) {
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
      this.formRequiredError = false;
    }
    if (this.duplicateCompany && this.duplicateCompanyName) {
      this.childDuplicateMessage = "companies.duplicateErrorMessage";
    }
    else if (this.duplicateCompany) {
      this.childDuplicateMessage = "companies.duplicateCodeErrorMessage";
      this.childDuplicateMessageParam = this.companyForm.value.companyCode;
    }
    else if (this.duplicateCompanyName) {
      this.childDuplicateMessage = "companies.duplicateNameErrorMessage";
      this.childDuplicateMessageParam = this.companyForm.value.companyName;
    }

    if (this.validCompanyName) {
      this.duplicateMessage = "companies.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.customerDiscountForm.value.companyName;
    }
  }

  checkForDuplicateCompanyCode() {
    this.duplicateCompany = this.masterService.hasDataExist(this.typeaheadCompanyDataList, 'companyCode', this.companyForm.value.companyCode);
    this.getDuplicateErrorMessages();
  }

  checkForDuplicateCompanyName() {
    this.duplicateCompanyName = this.masterService.hasDataExist(this.gridDataList, 'companyName', this.companyForm.value.companyName);
    this.getDuplicateErrorMessages();
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
      this.loadCompanyTypeaheadData();
      this.modalRef.hide();
      this.companyForm.reset();
    }, (error) => {
      throw error;
    });
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
    this.customerDiscountForm.reset();
    this.gridSelectedRow = null;
    this.selectedCustomerTypeahead = null;
    this.gridDataList = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.formRequiredError = false;
    this.formRequiredError = this.formSuccess = false;
    this.validCompanyName= false;
    this.loadCompanyTypeaheadData();
    this.loadGridData();
    this.customerDiscountForm.patchValue({ discountType: false });
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.customerDiscountForm.reset(s);
    this.nameFlag = true;
    this.deleteFlag = false;
    //this.deleteFlag = !this.gridSelectedRow.deleteFlag;
  }

  resetChildForm() {
    this.scFormRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
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
      'Company',
      'companies.saveInformationMessage',
      ''
    );
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe();
  }

  showConfirmationModal(eventType): void {
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      'Company',
      'companies.saveConfirmationMessage',
      'green',
      ''
    );

    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.saveChildCmpData();
      }
    });
  }
}
