import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-internal-stock-adj',
  templateUrl: './internal-stock-adj.component.html'
})
export class InternalStockAdjComponent implements OnInit {

  private internalStockForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "internalStockAdjustments/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateNum: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private internalStockList: any = [];
  private productsList: any = [];
  public gridDataList: any = [];
  public typeList: any = [];
  private duplicateNumber = false;
  private suppliersList: any = [];
  private childDuplicateMessage: string = null;
  private childDuplicateMessageParam: string = null;
  private savedProductId = 0;
  public typeDataList: any = [];


  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');

  }

  ngOnInit() {
    this.internalStockForm = this.fb.group({
      id: [],
      number: [],
      //orderNumber: ['', Validators.required],
      remarks: ['', Validators.required],
      date: ['', Validators.required],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],
      
      pack: ['', Validators.required],
      type: ['', Validators.required],
      batch: ['', Validators.required],
      qty: ['', Validators.required],
      free: ['', Validators.required]
     
    });
    this.loadProductData();
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
  
  getDuplicateErrorMessages(): void {
    if (!this.duplicateNumber) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateNumber) {
      this.duplicateMessage = 'internalStockAdj.duplicateNameErrorMessage';
      this.duplicateMessageParam = this.internalStockForm.value.number;
    }
  }

  onSelectProduct(event) {
    this.internalStockForm.patchValue({ pack: event.item.packing });
    this.internalStockForm.patchValue({ free: event.item.free });
    this.internalStockForm.patchValue({ productId: event.item.id });
    this.internalStockForm.patchValue({ productcode: event.item.productcode });

    if (this.savedProductId >= 0 && this.savedProductId !== event.item.id) {
      this.internalStockForm.patchValue({ productId: event.item.id });
      this.internalStockForm.patchValue({ number: this.gridDataList.length + 1 });
    }
  }

  
  

  save() {
    this.savedProductId = this.internalStockForm.value.productId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  deleteOrder() {
    this.buttonsComponent.manualDelete(this.endPoint + '/orderNumber', this.internalStockForm.value.orderNumber);
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    this.resetForm(null);
       this.loadGridData();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm(param) {
    const tempSupplierId = this.internalStockForm.value.accountInformationId;
    const tempSupplierName = this.internalStockForm.value.supplier;
    const tempOrderNum = this.internalStockForm.value.orderNumber;
    this.internalStockForm.reset();
    if ((param === undefined || param === null )&& !this.nameFlag) {
      this.internalStockForm.patchValue({ accountInformationId: tempSupplierId });
      this.internalStockForm.patchValue({ supplier: tempSupplierName });
      this.internalStockForm.patchValue({ orderNumber: tempOrderNum });
    }

    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateNumber = false;
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
    this.internalStockForm.reset(s);
    //  const productObj = _.find(this.productsList, function(o) {return o.id == s.productId; });
    //  this.internalStockForm.patchValue({ productBoxPack: productObj.boxQty });
  }
}
