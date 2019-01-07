import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-purchase-returns',
  templateUrl: './purchase-returns.component.html'
})
export class PurchaseReturnsComponent implements OnInit {

  private purchaseReturnsForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "purchaseReturns/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicatePurRetnNo: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private PurRetnList: any = [];
  private suppliersList: any = [];
  private productsList: any = [];
  public gridDataList: any = [];
  private childDuplicateMessage: string = null;
  private childDuplicateMessageParam: string = null;
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
    this.purchaseReturnsForm = this.fb.group({
      id: [],
      purReturnNumber: [],
      supplier: ['', Validators.required],
      remarks: [],
      date: ['', Validators.required],
      productName: ['', Validators.required],
      batch: ['', Validators.required],
      qty: ['', Validators.required],
      free: ['', Validators.required],
      pRate: ['', Validators.required],
      accountInformationId: [],
      productId: [],
      netRate: ['', Validators.required],
      ammount: ['', Validators.required]
    });
    this.loadSupplierData();
    this.loadProductData();
    //  this.rolesList = this.sharedDataService.getSharedCommonJsonData().UserRoles;
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

  loadSupplierData() {
    this.masterService.getParentData('accountinformation/').subscribe(list => {
      this.suppliersList = list;
    });
  }

  checkForDuplicatePurRetnNo() {
    if (!this.nameFlag) {
      this.duplicatePurRetnNo = this.masterService.hasDataExist(this.PurRetnList, 'purReturnNumber', this.purchaseReturnsForm.value.purReturnNumber);
      this.getDuplicateErrorMessages();
    }

  }



  getDuplicateErrorMessages(): void {
    if (!this.duplicatePurRetnNo) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicatePurRetnNo) {
      this.duplicateMessage = "purchaseReturn.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.purchaseReturnsForm.value.purReturnNumber;
    }
  }



  onSelectProduct(event) {

    this.purchaseReturnsForm.patchValue({ free: event.item.free });

    this.purchaseReturnsForm.patchValue({ productId: event.item.id });
    this.purchaseReturnsForm.patchValue({ netRate: event.item.netRate });
    this.purchaseReturnsForm.patchValue({ productcode: event.item.productcode });

  }
  onSelectSupplier(event) {
 this.purchaseReturnsForm.patchValue({ accountInformationId: event.item.id });
  }
  calculateRate() {
    this.purchaseReturnsForm.patchValue({ pRate: this.purchaseReturnsForm.value.qty * this.purchaseReturnsForm.value.netRate });
    this.purchaseReturnsForm.patchValue({ ammount: this.purchaseReturnsForm.value.qty * this.purchaseReturnsForm.value.netRate });
  }

  generateReturnNo(){
    if(!this.purchaseReturnsForm.value.purReturnNumber){
      if(this.gridDataList && this.gridDataList.length == 0){
        this.purchaseReturnsForm.patchValue({ purReturnNumber: 1});
      }else{
        let orderN0 = Math.max.apply(Math, this.gridDataList.map(function(o) { return o.purReturnNumber; }))
        this.purchaseReturnsForm.patchValue({ purReturnNumber: orderN0+1});
      } 
    }        
  }
  save() {
    this.generateReturnNo(); 
    this.savedSupplierId = this.purchaseReturnsForm.value.suplierId;
    this.buttonsComponent.save();
    
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    const tempSupplierId = this.purchaseReturnsForm.value.accountInformationId;
    const tempSupplierName = this.purchaseReturnsForm.value.supplier;
    this.resetForm(null);
    this.purchaseReturnsForm.value.accountInformationId = tempSupplierId;
    this.purchaseReturnsForm.value.supplier = tempSupplierName;
    this.loadGridData();

  }
  resetForm(param) {
    const tempSupplierId = this.purchaseReturnsForm.value.accountInformationId;
    const tempSupplierName = this.purchaseReturnsForm.value.supplier;
    const temppurReturnNumber = this.purchaseReturnsForm.value.purReturnNumber;
    const tempRemarks = this.purchaseReturnsForm.value.remarks;
    this.purchaseReturnsForm.reset();
    if ((param === undefined || param === null )&& !this.nameFlag) {
      this.purchaseReturnsForm.patchValue({ accountInformationId: tempSupplierId });
      this.purchaseReturnsForm.patchValue({ supplier: tempSupplierName });
      this.purchaseReturnsForm.patchValue({remarks: tempRemarks });
      this.purchaseReturnsForm.patchValue({ purReturnNumber: temppurReturnNumber });
    }

    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicatePurRetnNo = false;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

 

  editable(s) {
    this.nameFlag = true;
    this.formRequiredError = false;
    this.childDuplicateMessage = null;
    this.childDuplicateMessageParam = null;
    this.deleteFlag = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.purchaseReturnsForm.reset(s);

  }
}
