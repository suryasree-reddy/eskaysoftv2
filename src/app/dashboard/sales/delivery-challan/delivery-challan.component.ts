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
  public productForm: FormGroup;
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
      gstp: ['', Validators.required],
      dcNo: ['', Validators.required]

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
    if (this.savedSupplierId >= 0 && this.savedSupplierId !== event.item.id) {
      this.deliveryChallanForm.patchValue({ accountInformationId: event.item.id });
      this.deliveryChallanForm.patchValue({ gstIN: event.item.gstIN });
      this.deliveryChallanForm.patchValue({ dcNo: this.gridDataList.length + 1 });
    }
  }

  save() {
    this.savedSupplierId = this.deliveryChallanForm.value.accountInformationId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + '/deliveryChallanForm', this.deliveryChallanForm.value.deliveryChallanForm);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.deliveryChallanForm.value.accountInformationId;
    const tempSupplierName = this.deliveryChallanForm.value.customer;
    this.resetForm(null);
    this.deliveryChallanForm.value.accountInformationId = tempSupplierId;
    this.deliveryChallanForm.value.customer = tempSupplierName;
    //  this.loadGridData();
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.deliveryChallanForm.value.accountInformationId;
    const tempSupplierName = this.deliveryChallanForm.value.customer;
    const tempOrderNum = this.deliveryChallanForm.value.dcNo;
    this.deliveryChallanForm.reset();
    if ((param === undefined || param === null) && !this.nameFlag) {
      this.deliveryChallanForm.patchValue({ accountInformationId: tempSupplierId });
      this.deliveryChallanForm.patchValue({ customer: tempSupplierName });
      this.deliveryChallanForm.patchValue({ dcNo: tempOrderNum });
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
