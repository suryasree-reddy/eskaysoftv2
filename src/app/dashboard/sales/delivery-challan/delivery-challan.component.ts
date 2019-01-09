import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

import * as _ from 'lodash';

@Component({
  selector: 'app-delivery-challan',
  templateUrl: './delivery-challan.component.html'
})
export class DeliveryChallanComponent implements OnInit {
 
  public deliveryChallanForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint = 'gSTChallan/';
  private formSuccess = false;
  private formRequiredError = false;
  private nameFlag = false;
  public gridDataList: any = [];
  private productsList: any = [];
  private customersList: any = [];
  public modeTypeList: any = [];
  public accGstTypeList: any = [];
  private savedSupplierId = 0;
  private saveProductId = 0;
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
    this.deliveryChallanForm = this.fb.group({
      id: [],
      gstType: ['', Validators.required],
      mode: ['', Validators.required],
      date: ['', Validators.required],

      accountInformationId: ['', Validators.required],
      customer: ['', Validators.required],
      gstIN: ['', Validators.required],
      deliverTo: ['', Validators.required],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],
      free: ['', Validators.required],
      batch: ['', Validators.required],
      expiry: ['', Validators.required],
      qty: ['', Validators.required],
      sRate: ['', Validators.required],
      disc: ['', Validators.required],
      dcNo: [''],
      serialNumber: [''],
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
    this.deliveryChallanForm.patchValue({ pack: event.item.packing });
    this.deliveryChallanForm.patchValue({ free: event.item.free });
    this.deliveryChallanForm.patchValue({ productBoxPack: event.item.boxQty });
    this.deliveryChallanForm.patchValue({ productId: event.item.id });
    this.deliveryChallanForm.patchValue({ productcode: event.item.productcode });
    this.deliveryChallanForm.patchValue({ netRate: event.item.netRate });
    this.calculateRate();
  }

  calculateRate() {

    this.deliveryChallanForm.patchValue({ sRate: this.deliveryChallanForm.value.free * this.deliveryChallanForm.value.qty });
  }

  onSelectSupplier(event) {
 
      this.deliveryChallanForm.patchValue({ accountInformationId: event.item.id });
      this.deliveryChallanForm.patchValue({ gstIN: event.item.gstIN });
 
    }
    generateOrderNo(){
      if(!this.deliveryChallanForm.value.dcNo){
        if(this.gridDataList && this.gridDataList.length == 0){
          this.deliveryChallanForm.patchValue({ dcNo: 1});
        }else{
          let orderN0 = Math.max.apply(Math, this.gridDataList.map(function(o) { return o.dcNo; }))
          this.deliveryChallanForm.patchValue({ dcNo: orderN0 + 1});
        } 
      }        
    }
    generateSerialNo(){
      let subList = this.gridDataList.filter(v => v.dcNo === this.deliveryChallanForm.value.dcNo)
      if(subList && subList.length == 0){
        this.deliveryChallanForm.patchValue({ serialNumber: 1});
      }else{
        let serialN0 = Math.max.apply(Math, subList.map(function(o) { return o.serialNumber; }))
        this.deliveryChallanForm.patchValue({ serialNumber: serialN0 + 1});
      }
    }

  save() {
    this.savedSupplierId = this.deliveryChallanForm.value.accountInformationId;
    this.saveProductId = this.deliveryChallanForm.value.productId;
    this.generateOrderNo();
    this.generateSerialNo();
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + 'dcno/', this.deliveryChallanForm.value.dcNo);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.deliveryChallanForm.value.accountInformationId;
    const tempSupplierName = this.deliveryChallanForm.value.supplier;
    const tempProductId = this.deliveryChallanForm.value.productId;
    const tempproductName = this.deliveryChallanForm.value.productName;
    this.resetForm(null);
    this.deliveryChallanForm.value.accountInformationId = tempSupplierId;
    this.deliveryChallanForm.value.supplier = tempSupplierName;
    this.deliveryChallanForm.value.productId = tempProductId;
    this.deliveryChallanForm.value.productName = tempproductName;
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.deliveryChallanForm.value.accountInformationId;
    const tempSupplierName = this.deliveryChallanForm.value.customer;
    const tempGstIn = this.deliveryChallanForm.value.gstIN;
    const tempdelv = this.deliveryChallanForm.value.deliverTo
    const tempOrderNum = this.deliveryChallanForm.value.dcNo;
    const tempFree = this.deliveryChallanForm.value.free;
    const tempDcdate = this.deliveryChallanForm.value.date;
    const tempproductId = this.deliveryChallanForm.value.productId;
    const tempproduct = this.deliveryChallanForm.value.productName;
    const tempproductcode = this.deliveryChallanForm.value.productcode;
    this.deliveryChallanForm.reset();
    if ((param === undefined || param === null) && !this.nameFlag) {
      this.deliveryChallanForm.patchValue({ accountInformationId: tempSupplierId });
      this.deliveryChallanForm.patchValue({ customer: tempSupplierName });
      this.deliveryChallanForm.patchValue({gstIN: tempGstIn});
      this.deliveryChallanForm.patchValue({deliverTo: tempdelv});
      this.deliveryChallanForm.patchValue({productId: tempproductId});
      this.deliveryChallanForm.patchValue({productName: tempproduct});
      this.deliveryChallanForm.patchValue({ dcNo: tempOrderNum });
      this.deliveryChallanForm.patchValue({free: tempFree});
      this.deliveryChallanForm.patchValue({date: tempDcdate});
      this.deliveryChallanForm.patchValue({productcode: tempproductcode});
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
    this.deliveryChallanForm.reset(s);
    const productObj = _.find(this.productsList, function (o) { return o.id === s.productId; });
    this.onSelectProduct({ item: productObj });
  }
}
