import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
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
  private endPoint: string = "customerwisediscount/";
  private cEndPoint: string = "company/";
  private aiEndPoint: string = "accountinformation/";
  @Input() gridDataList: any = [];
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public companyTypeList: any = [];
  public companyStatusList: any = [];
  public invGenList: any = [];
  private validCompanyName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  public typeaheadCompanyDataList: any = [];
  public typeaheadCustomerDataList: any = [];
  public selectedCompanyTypeahead: any;
  public selectedCustomerTypeahead: any;
  private discountType: boolean = false;
  modalRef: BsModalRef;
  message: string;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @ViewChild('focus') focusField: ElementRef;
  @Input() isModelWindowView: boolean = false;
  @Input() bodyStyle: string = "col-xs-5";
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();

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

    this.loadCompanyTypeaheadData();
    this.loadCustomerTypeaheadData();
    this.companyTypeList = this.sharedDataService.getSharedCommonJsonData().CompanyType;
    this.companyStatusList = this.sharedDataService.getSharedCommonJsonData().CompanyStatus;
    this.invGenList = this.sharedDataService.getSharedCommonJsonData().InvGenType;
    this.focusField.nativeElement.focus();
  }

  loadCustomerTypeaheadData() {
    this.masterService.getParentData(this.aiEndPoint).subscribe(list => {
      this.typeaheadCustomerDataList = list;
    });
  }

  loadCompanyTypeaheadData() {
    this.masterService.getParentData(this.cEndPoint).subscribe(list => {
      this.typeaheadCompanyDataList = list;
    });
  }

  loadSelectedCustomerTypeahead(event) {
    this.formRequiredError = false;
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
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  getDuplicateErrorMessages(): void {
    if (!this.validCompanyName) {
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
      this.formRequiredError = false;
    }
    if (this.validCompanyName) {
      this.duplicateMessage = "companies.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.customerDiscountForm.value.companyName;
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
    if (this.modalRef !== undefined && this.modalRef !== null) {
      this.modalRef.hide();
      this.modalService.hide(1);
      this.modalRef = null;
      this.loadCompanyTypeaheadData();

    } else {
      if(this.isModelWindowView){
        this.callbackOnModelWindowClose.emit();
      }else{
        this.formSuccess = true;
        this.formRequiredError = false;
        this.resetForm();
      }
    }
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.customerDiscountForm.reset();
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
    if(!this.isModelWindowView){
        this.loadGridData();
    }
    this.customerDiscountForm.patchValue({ discountType: false });
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.customerDiscountForm.reset(s);
    this.nameFlag = true;
    this.deleteFlag = false;
  }

}
