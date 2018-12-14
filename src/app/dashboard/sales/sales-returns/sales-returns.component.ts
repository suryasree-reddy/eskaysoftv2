import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

import * as _ from 'lodash';

@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html'
})
export class SalesReturnsComponent implements OnInit {

  public salesReturnForm: FormGroup;
  private deleteFlag = true;
  private endPoint = 'salesReturns/';
  private formSuccess = false;
  private formRequiredError = false;
  private nameFlag = false;
  public gridDataList: any = [];
  private productsList: any = [];
  private customersList: any = [];
  public modeTypeList: any = [];
  public accGstTypeList: any = [];
  private savedSupplierId = 0;
  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }
  ngOnInit() {
    this.salesReturnForm = this.fb.group({
      id: [],
      accountInformationId: ['', Validators.required],
      gstIN: ['', Validators.required],
      customer: ['', Validators.required],
      salesReturnNo: ['', Validators.required],
      salesReturnDate: ['', Validators.required],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],

      mode: ['', Validators.required],
      gstType: ['', Validators.required],

      free: ['', Validators.required],
      batch: ['', Validators.required],

      expiry: ['', Validators.required],
      qty: ['', Validators.required],
      sRate: ['', Validators.required],
      disc: ['', Validators.required],
      gstp: ['', Validators.required]
    });
    this.loadProductData();
    this.loadCustomerData();
    this.modeTypeList = this.sharedDataService.getSharedCommonJsonData().Mode;
    this.accGstTypeList = this.sharedDataService.getSharedCommonJsonData().GstType;
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  loadProductData() {
    this.masterService.getParentData('product/').subscribe(list => {
      this.productsList = list;
    });
  }

  loadCustomerData() {
    this.masterService.getParentData('accountinformation/').subscribe(list => {
      this.customersList = list;
    });
  }

  onSelectProduct(event) {
    this.salesReturnForm.patchValue({ pack: event.item.packing });
    this.salesReturnForm.patchValue({ free: event.item.free });
    this.salesReturnForm.patchValue({ productBoxPack: event.item.boxQty });
    this.salesReturnForm.patchValue({ productId: event.item.id });
    this.salesReturnForm.patchValue({ productcode: event.item.productcode });
    this.salesReturnForm.patchValue({ netRate: event.item.netRate });
    this.calculateRate();
  }

  calculateRate() {

    this.salesReturnForm.patchValue({ sRate: this.salesReturnForm.value.free * this.salesReturnForm.value.qty });

  }

  onSelectSupplier(event) {
    if (this.savedSupplierId >= 0 && this.savedSupplierId !== event.item.id) {
      this.salesReturnForm.patchValue({ accountInformationId: event.item.id });
      this.salesReturnForm.patchValue({ gstIN: event.item.gstIN });
      this.salesReturnForm.patchValue({ salesReturnNo: this.gridDataList.length + 1 });
    }
  }

  save() {
    this.savedSupplierId = this.salesReturnForm.value.accountInformationId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + '/salesReturnForm', this.salesReturnForm.value.salesReturnForm);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.salesReturnForm.value.accountInformationId;
    const tempSupplierName = this.salesReturnForm.value.customer;
    this.resetForm(null);
    this.salesReturnForm.value.accountInformationId = tempSupplierId;
    this.salesReturnForm.value.customer = tempSupplierName;
    //  this.loadGridData();
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.salesReturnForm.value.accountInformationId;
    const tempSupplierName = this.salesReturnForm.value.supplier;
    const tempOrderNum = this.salesReturnForm.value.salesReturnNo;
    this.salesReturnForm.reset();
    if ((param === undefined || param === null) && !this.nameFlag) {
      this.salesReturnForm.patchValue({ accountInformationId: tempSupplierId });
      this.salesReturnForm.patchValue({ customer: tempSupplierName });
      this.salesReturnForm.patchValue({ salesReturnNo: tempOrderNum });
    }
    this.deleteFlag = true;
    this.nameFlag = false;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
  }

  editable(s) {
    this.nameFlag = true;
    this.formRequiredError = false;
    this.deleteFlag = false;
    this.salesReturnForm.reset(s);
    const productObj = _.find(this.productsList, function (o) { return o.id === s.productId; });
    this.onSelectProduct({ item: productObj });
  }
}
