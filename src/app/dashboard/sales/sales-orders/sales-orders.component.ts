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
  private totalValue;

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
      accountInformationId: [],
      orderNumber: [''],
      serialNumber:[''],
      customer: ['', Validators.required],
      remarks: [],
      date: ['', Validators.required],
      productId: [],
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
    this.totalCalculation();
  }
  totalCalculation(){
    let total = 0;
    this.gridDataList.forEach(element => { 
      total += parseInt(element.value);     
    });
    this.totalValue = total;
  }
  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      this.totalCalculation();
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
    this.salesOrderForm.patchValue({ accountInformationId: event.item.id });   
  }
  generateOrderNo(){
    if(!this.salesOrderForm.value.orderNumber){
      if(this.gridDataList && this.gridDataList.length == 0){
        this.salesOrderForm.patchValue({ orderNumber: 1});
      }else{
        let orderN0 = Math.max.apply(Math, this.gridDataList.map(function(o) { return o.orderNumber; }))
        this.salesOrderForm.patchValue({ orderNumber: orderN0+1});
      } 
    }        
  }
  generateSerialNo(){
    let subList = this.gridDataList.filter(v => v.orderNumber === this.salesOrderForm.value.orderNumber)
    if(subList && subList.length == 0){
      this.salesOrderForm.patchValue({ serialNumber: 1});
    }else{
      let serialN0 = Math.max.apply(Math, subList.map(function(o) { return o.serialNumber; }))
      this.salesOrderForm.patchValue({ serialNumber: serialN0+1});
    }
  }
  save() {
    this.savedSupplierId = this.salesOrderForm.value.accountInformationId;     
    this.generateOrderNo(); 
    this.generateSerialNo();     
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + 'orderNumber/', this.salesOrderForm.value.orderNumber);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.salesOrderForm.value.accountInformationId;
    const tempSupplierName = this.salesOrderForm.value.customer;
    this.resetForm(null);
    this.salesOrderForm.value.accountInformationId = tempSupplierId;
    this.salesOrderForm.value.customer = tempSupplierName;
    }

  requiredErrMsg() {
      this.formRequiredError = true;
      this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.salesOrderForm.value.accountInformationId;
    const tempSupplierName = this.salesOrderForm.value.customer;
    const tempOrderNum = this.salesOrderForm.value.orderNumber;
    const tempDate = this.salesOrderForm.value.date;
    const tempRemarks = this.salesOrderForm.value.remarks;
    this.salesOrderForm.reset();
    if ((param === undefined || param === null ) && !this.nameFlag) {
      this.salesOrderForm.patchValue({ accountInformationId: tempSupplierId });
      this.salesOrderForm.patchValue({ customer: tempSupplierName });
      this.salesOrderForm.patchValue({ orderNumber: tempOrderNum });
      this.salesOrderForm.patchValue({ date: tempDate });
      this.salesOrderForm.patchValue({ remarks: tempRemarks });
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
    const productObj = _.find(this.productsList, function(o) {return o.id === s.productId; });
    this.onSelectProduct({item : productObj});
  }
}