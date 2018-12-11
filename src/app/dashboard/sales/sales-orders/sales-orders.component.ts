import { Component, OnInit, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';


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
  private duplicateName = false;
  private duplicateOrderNo = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  public gridDataList: any = [];
  private productsList: any = [];
  private customersList: any = [];
  private childDuplicateMessage: string = null;
  private childDuplicateMessageParam: string = null;
  private savedCustomerId = 0;
  public typeList: any = [];

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

  
  getDuplicateErrorMessages(): void {
    if (!this.duplicateOrderNo) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateOrderNo) {
      this.duplicateMessage = 'salesOrder.duplicateNameErrorMessage';
      this.duplicateMessageParam = this.salesOrderForm.value.orderNumber;
    }
  }

  onSelectProduct(event) {
    this.salesOrderForm.patchValue({ pack: event.item.packing });
    this.salesOrderForm.patchValue({ free: event.item.free });
    this.salesOrderForm.patchValue({ productBoxPack: event.item.boxQty });
    this.salesOrderForm.patchValue({ productId: event.item.id });
    this.salesOrderForm.patchValue({ productcode: event.item.productcode });
    // this.salesOrderForm.patchValue({ bQty: event.item.bQty });
    // this.salesOrderForm.patchValue({ bFree: event.item.free * event.item.bQty });
    this.salesOrderForm.patchValue({ netRate: event.item.netRate });
    //  const productPurchaseList = _.filter(this.gridDataList, function(o) {return o.productId == event.item.id });
    //  this.salesOrderForm.patchValue({ orderNumber: productPurchaseList.length + 1 });
  }

  calculateRate() {
    this.salesOrderForm.patchValue({ rate: this.salesOrderForm.value.qty * this.salesOrderForm.value.netRate });
    this.salesOrderForm.patchValue({ bQty: this.salesOrderForm.value.qty / this.salesOrderForm.value.productBoxPack });
    this.salesOrderForm.patchValue({ bRate: this.salesOrderForm.value.bQty * this.salesOrderForm.value.rate });
    this.salesOrderForm.patchValue({ value: this.salesOrderForm.value.rate * this.salesOrderForm.value.qty });
    this.salesOrderForm.patchValue({ bFree: this.salesOrderForm.value.bQty * this.salesOrderForm.value.free });
  }

  onSelectCustomer(event) {
    if (this.savedCustomerId >= 0 && this.savedCustomerId !== event.item.id) {
      this.salesOrderForm.patchValue({ accountInformationId: event.item.id });
      this.salesOrderForm.patchValue({ orderNumber: this.gridDataList.length + 1 });
    }
  }

  save() {
    this.savedCustomerId = this.salesOrderForm.value.accountInformationId;
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
    this.loadGridData();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm(param) {
    const tempSupplierId = this.salesOrderForm.value.accountInformationId;
    const tempSupplierName = this.salesOrderForm.value.supplier;
    const tempOrderNum = this.salesOrderForm.value.orderNumber;
    this.salesOrderForm.reset();
    if ((param === undefined || param === null )&& !this.nameFlag) {
      this.salesOrderForm.patchValue({ accountInformationId: tempSupplierId });
      this.salesOrderForm.patchValue({ supplier: tempSupplierName });
      this.salesOrderForm.patchValue({ orderNumber: tempOrderNum });
    }

    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateOrderNo = false;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
  }

  editable(s) {
    this.nameFlag = true;
    this.formRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    //  this.deleteFlag = !s.deleteFlag;
    this.deleteFlag = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.salesOrderForm.reset(s);
    //  const productObj = _.find(this.productsList, function(o) {return o.id == s.productId; });
    //  this.salesOrderForm.patchValue({ productBoxPack: productObj.boxQty });
  }
}
