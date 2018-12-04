import { Component, OnInit, TemplateRef, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html'
})
export class ProductComponent implements OnInit {

  public productForm: FormGroup;
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
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  modalRef: BsModalRef;
  message: string;

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

    this.loadGroupTypeaheadData();
    this.loadCategoryTypeaheadData();
    this.loadCompanyTypeaheadData();
    this.loadCompanyGroupTypeaheadData();
    this.loadTaxTypeaheadData();
    this.companyTypeList = this.sharedDataService.getSharedCommonJsonData().CompanyType;
    this.companyStatusList = this.sharedDataService.getSharedCommonJsonData().CompanyStatus;
    this.invGenList = this.sharedDataService.getSharedCommonJsonData().InvGenType;
    this.focusField.nativeElement.focus();

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
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  getDuplicateErrorMessages(): void {
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
      this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    if (this.modalRef != undefined) {
      this.modalRef.hide();
      this.modalService.hide(1);
      this.loadGroupTypeaheadData();
      this.loadCategoryTypeaheadData();
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
    this.nameFlag = true;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    // this.deleteFlag = !this.gridSelectedRow.deleteFlag;
  }



}
