import { Component, OnInit, TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';
import * as _ from 'lodash';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit {

  public salesInvocieForm: FormGroup;
  private deleteFlag = true;
  private endPoint: string = "salesInvoice/";
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
    this.salesInvocieForm = this.fb.group({
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
      salesInvNo: [''],
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
    this.salesInvocieForm.patchValue({ pack: event.item.packing });
    this.salesInvocieForm.patchValue({ free: event.item.free });
    this.salesInvocieForm.patchValue({ productBoxPack: event.item.boxQty });
    this.salesInvocieForm.patchValue({ productId: event.item.id });
    this.salesInvocieForm.patchValue({ productcode: event.item.productcode });
    this.salesInvocieForm.patchValue({ netRate: event.item.netRate });
    this.calculateRate();
  }

  calculateRate() {

    this.salesInvocieForm.patchValue({ sRate: this.salesInvocieForm.value.free * this.salesInvocieForm.value.qty });
  }

  onSelectSupplier(event) {
 
      this.salesInvocieForm.patchValue({ accountInformationId: event.item.id });
      this.salesInvocieForm.patchValue({ gstIN: event.item.gstIN });
 
    }
    generateOrderNo(){
      if(!this.salesInvocieForm.value.salesInvNo){
        if(this.gridDataList && this.gridDataList.length == 0){
          this.salesInvocieForm.patchValue({ salesInvNo: 1});
        }else{
          let orderN0 = Math.max.apply(Math, this.gridDataList.map(function(o) { return o.salesInvNo; }))
          this.salesInvocieForm.patchValue({ salesInvNo: orderN0 + 1});
        } 
      }        
    }
    generateSerialNo(){
      let subList = this.gridDataList.filter(v => v.salesInvNo === this.salesInvocieForm.value.salesInvNo)
      if(subList && subList.length == 0){
        this.salesInvocieForm.patchValue({ serialNumber: 1});
      }else{
        let serialN0 = Math.max.apply(Math, subList.map(function(o) { return o.serialNumber; }))
        this.salesInvocieForm.patchValue({ serialNumber: serialN0 + 1});
      }
    }

  save() {
    this.savedSupplierId = this.salesInvocieForm.value.accountInformationId;
    this.saveProductId = this.salesInvocieForm.value.productId;
    this.generateOrderNo();
    this.generateSerialNo();
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + 'dcno/', this.salesInvocieForm.value.salesInvNo);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.salesInvocieForm.value.accountInformationId;
    const tempSupplierName = this.salesInvocieForm.value.supplier;
    const tempProductId = this.salesInvocieForm.value.productId;
    const tempproductName = this.salesInvocieForm.value.productName;
    this.resetForm(null);
    this.salesInvocieForm.value.accountInformationId = tempSupplierId;
    this.salesInvocieForm.value.supplier = tempSupplierName;
    this.salesInvocieForm.value.productId = tempProductId;
    this.salesInvocieForm.value.productName = tempproductName;
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.salesInvocieForm.value.accountInformationId;
    const tempSupplierName = this.salesInvocieForm.value.customer;
    const tempGstIn = this.salesInvocieForm.value.gstIN;
    const tempdelv = this.salesInvocieForm.value.deliverTo
    const tempOrderNum = this.salesInvocieForm.value.salesInvNo;
    const tempFree = this.salesInvocieForm.value.free;
    const tempDcdate = this.salesInvocieForm.value.date;
    const tempproductId = this.salesInvocieForm.value.productId;
    const tempproduct = this.salesInvocieForm.value.productName;
    const tempproductcode = this.salesInvocieForm.value.productcode;
    this.salesInvocieForm.reset();
    if ((param === undefined || param === null) && !this.nameFlag) {
      this.salesInvocieForm.patchValue({ accountInformationId: tempSupplierId });
      this.salesInvocieForm.patchValue({ customer: tempSupplierName });
      this.salesInvocieForm.patchValue({gstIN: tempGstIn});
      this.salesInvocieForm.patchValue({deliverTo: tempdelv});
      this.salesInvocieForm.patchValue({productId: tempproductId});
      this.salesInvocieForm.patchValue({productName: tempproduct});
      this.salesInvocieForm.patchValue({ salesInvNo: tempOrderNum });
      this.salesInvocieForm.patchValue({free: tempFree});
      this.salesInvocieForm.patchValue({date: tempDcdate});
      this.salesInvocieForm.patchValue({productcode: tempproductcode});
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
    this.salesInvocieForm.reset(s);
    const productObj = _.find(this.productsList, function (o) { return o.id === s.productId; });
    this.onSelectProduct({ item: productObj });
  }
}
