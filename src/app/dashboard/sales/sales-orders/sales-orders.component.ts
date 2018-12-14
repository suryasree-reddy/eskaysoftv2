import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

import * as _ from 'lodash';

@Component({
  selector: 'app-sales-orders',
  templateUrl: './sales-orders.component.html',

})
export class SalesOrdersComponent implements OnInit {

  public salesOrderForm: FormGroup;
  private deleteFlag = true;
  private endPoint = 'salesOrder/';
  private formSuccess = false;
  private formRequiredError = false;
  private nameFlag = false;
  public gridDataList: any = [];
  private productsList: any = [];
  private customersList: any = [];
  private savedSupplierId = 0;
  private typeList: any[];

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }
  
  ngOnInit() {
    this.salesOrderForm = this.fb.group({
      id: [],
      accountInformationId: ['', Validators.required],
      orderNumber: ['', Validators.required],
      customer: ['', Validators.required],
      remarks: ['', Validators.required],
      date: ['', Validators.required],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],
      pack: ['', Validators.required],
      qty: ['', Validators.required],
      netRate: ['', Validators.required],
      rate: ['', Validators.required],
      free: ['', Validators.required],
      value: ['', Validators.required],
      rateType: ['', Validators.required]
    });
    this.loadProductData();
    this.loadCustomerData();
    this.typeList = this.sharedDataService.getSharedCommonJsonData().Type;
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
    this.salesOrderForm.patchValue({ pack: event.item.packing });
    this.salesOrderForm.patchValue({ free: event.item.free });
    this.salesOrderForm.patchValue({ productBoxPack: event.item.boxQty });
    this.salesOrderForm.patchValue({ productId: event.item.id });
    this.salesOrderForm.patchValue({ productcode: event.item.productcode });
    this.salesOrderForm.patchValue({ netRate: event.item.netRate });
    this.calculateRate();
  }

  calculateRate() {
    this.salesOrderForm.patchValue({ rate: this.salesOrderForm.value.qty * this.salesOrderForm.value.netRate });
    this.salesOrderForm.patchValue({ value: this.salesOrderForm.value.rate * this.salesOrderForm.value.qty });


  }

  onSelectSupplier(event) {
    if (this.savedSupplierId >= 0 && this.savedSupplierId !== event.item.id) {
      this.salesOrderForm.patchValue({ accountInformationId: event.item.id });
      this.salesOrderForm.patchValue({ orderNumber: this.gridDataList.length + 1 });
    }
  }

  save() {
    this.savedSupplierId = this.salesOrderForm.value.accountInformationId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + '/orderNumber', this.salesOrderForm.value.orderNumber);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.salesOrderForm.value.accountInformationId;
    const tempSupplierName = this.salesOrderForm.value.supplier;
    this.resetForm(null);
    this.salesOrderForm.value.accountInformationId = tempSupplierId;
    this.salesOrderForm.value.supplier = tempSupplierName;
    //  this.loadGridData();
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.salesOrderForm.value.accountInformationId;
    const tempSupplierName = this.salesOrderForm.value.supplier;
    const tempOrderNum = this.salesOrderForm.value.orderNumber;
    this.salesOrderForm.reset();
    if ((param === undefined || param === null) && !this.nameFlag) {
      this.salesOrderForm.patchValue({ accountInformationId: tempSupplierId });
      this.salesOrderForm.patchValue({ supplier: tempSupplierName });
      this.salesOrderForm.patchValue({ orderNumber: tempOrderNum });
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
    this.salesOrderForm.reset(s);
    const productObj = _.find(this.productsList, function (o) { return o.id === s.productId; });
    this.onSelectProduct({ item: productObj });
  }
}