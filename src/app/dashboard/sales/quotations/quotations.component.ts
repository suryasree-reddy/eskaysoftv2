import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

import * as _ from 'lodash';

@Component({
  selector: 'app-quotations',
  templateUrl: './quotations.component.html'
})
export class QuotationsComponent implements OnInit {

  public  quotationForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "quatationEntry/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  public gridDataList: any = [];
  private productsList: any = [];
  private customersList: any = [];
  private savedSupplierId = 0;
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
    this.quotationForm = this.fb.group({
      id: [],
      orderNumber: [''],
      serialNumber:[''],
      accountInformationId: ['', Validators.required],
      customer: ['', Validators.required],
      remarks: [],
      date: ['', Validators.required],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],
      packing:['', Validators.required],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      ammount:['', Validators.required]
    });
    this.loadProductData();
    this.loadCustomerData();
  }

  onInitialDataLoad(dataList: any[]) {
    this.gridDataList = dataList;
    this.totalCalculation();
  }
  totalCalculation(){
    let total = 0;
    this.gridDataList.forEach(element => { 
      total += parseInt(element.ammount);     
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
    this.quotationForm.patchValue({ packing: event.item.packing });
    this.quotationForm.patchValue({ productId: event.item.id });
    this.quotationForm.patchValue({ productcode: event.item.productcode });
    this.calculateRate();    
  }

  calculateRate() {
    // this.quotationForm.patchValue({ rate: this.quotationForm.value.qty * this.quotationForm.value.qty });
  this.quotationForm.patchValue({ ammount: this.quotationForm.value.rate * this.quotationForm.value.qty });
   
  }

  onSelectSupplier(event) {    
    this.quotationForm.patchValue({ accountInformationId: event.item.id });   
  }
  generateOrderNo(){
    if(!this.quotationForm.value.orderNumber){
      if(this.gridDataList && this.gridDataList.length == 0){
        this.quotationForm.patchValue({ orderNumber: 1});
      }else{
        let orderN0 = Math.max.apply(Math, this.gridDataList.map(function(o) { return o.orderNumber; }))
        this.quotationForm.patchValue({ orderNumber: orderN0+1});
      } 
    }        
  }
  generateSerialNo(){
    let subList = this.gridDataList.filter(v => v.orderNumber === this.quotationForm.value.orderNumber)
    if(subList && subList.length == 0){
      this.quotationForm.patchValue({ serialNumber: 1});
    }else{
      let serialN0 = Math.max.apply(Math, subList.map(function(o) { return o.serialNumber; }))
      this.quotationForm.patchValue({ serialNumber: serialN0+1});
    }
  }
  save() {
    this.savedSupplierId = this.quotationForm.value.accountInformationId;     
    this.generateOrderNo(); 
    this.generateSerialNo();     
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + 'orderNumber/', this.quotationForm.value.orderNumber);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.quotationForm.value.accountInformationId;
    const tempSupplierName = this.quotationForm.value.customer;
    this.resetForm(null);
    this.quotationForm.value.accountInformationId = tempSupplierId;
    this.quotationForm.value.customer = tempSupplierName;
    }

  requiredErrMsg() {
      this.formRequiredError = true;
      this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.quotationForm.value.accountInformationId;
    const tempSupplierName = this.quotationForm.value.customer;
    const tempOrderNum = this.quotationForm.value.orderNumber;
    const tempDate = this.quotationForm.value.date;
    const tempRemarks = this.quotationForm.value.remarks;
    this.quotationForm.reset();
    if ((param === undefined || param === null ) && !this.nameFlag) {
      this.quotationForm.patchValue({ accountInformationId: tempSupplierId });
      this.quotationForm.patchValue({ customer: tempSupplierName });
      this.quotationForm.patchValue({ orderNumber: tempOrderNum });
      this.quotationForm.patchValue({ date: tempDate });
      this.quotationForm.patchValue({ remarks: tempRemarks });
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
    this.quotationForm.reset(s);
    const productObj = _.find(this.productsList, function(o) {return o.id === s.productId; });
    this.onSelectProduct({item : productObj});
  }
}