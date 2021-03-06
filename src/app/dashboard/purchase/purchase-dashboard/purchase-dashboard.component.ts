import { Component, OnInit, NgModule, TemplateRef,Input, Output, ViewChild, ElementRef,EventEmitter     } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsDropdownModule, TypeaheadModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from 'src/app/dashboard/master/master.service';
import 'src/assets/styles/mainstyles.scss';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import { ButtonsComponent } from '../../../commonComponents/buttons/buttons.component';
import * as _ from 'lodash';
import { UserProfileComponent } from 'src/app/admin/user-profile/user-profile.component';
import { AuthenticationService } from 'src/app/auth/authentication.service';

@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html'
})

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsModalService,
    UserProfileComponent
  ],
})

export class PurchaseDashboardComponent implements OnInit {

  public purchaseForm: FormGroup;
  private endPoint: string = "purchaseentry/";
  private deleteFlag: boolean = true;
  private formSuccess = false;
  private formRequiredError = false;
  private nameFlag = false;
  public gridDataList: any = [];
  private productsList: any = [];
  private suppliersList: any = [];
  private creditAdjList: any = [];
  private debitAdjList: any = [];
  private manfacturerList: any = [];
 
  private typeaheadTaxDataList: any = [];
  private savedSupplierId = 0;
  private modeType: any[];
  

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  @Input() isModelWindowView: boolean = false;
  @Input() bodyStyle: string = "col-xs-12";
  @Output() callbackOnModelWindowClose: EventEmitter<null> = new EventEmitter();

  modalRef: BsModalRef;
  message: string;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService:SharedDataService,
    private modalService: BsModalService,
    private auth:AuthenticationService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  
  ngOnInit() {

    this.purchaseForm = this.fb.group({
      id: [],
      purchaseNumber: [],
      invoiceNumber:['', Validators.required],
      purDate: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      suplierId: [],
      supplier: [],
      gstIN: ['', Validators.required],
      wayBill: ['', Validators.required],
      transport: [],
      numberOfCases: ['', Validators.required],
     
      mode: ['', Validators.required],
      lrNumber: [],
      lrDate: ['', Validators.required],
      delvFrom: ['', Validators.required],
      productId: [],
      productcode: ['', Validators.required],
      productName: ['', Validators.required],
      batch:['', Validators.required],
      expiry:['', Validators.required],
      qty:['', Validators.required],
      othCharges:['', Validators.required],
      grsValue:['', Validators.required],
      discount:['', Validators.required],
      ptd:['', Validators.required],
      saleRate:['', Validators.required],
      taxId: [],
      tax:['', Validators.required],
      hsnCode:['', Validators.required],
      mrp:['', Validators.required],
      manfacturerId: [],
      mfgName:['', Validators.required],
      purRate:['', Validators.required],
      free: ['', Validators.required],
      grossValue: ['', Validators.required],
      discountValue: ['', Validators.required],
      taxValue: ['', Validators.required],
      netValue: ['', Validators.required],
      drAdjLedjerId: [],
      debitAdjustmentLedger:[],
      crAdjLedjerId: [],
      creditAdjustmentLedger:[],
      stateCode:[],
      debitAdjustmentValue: ['', Validators.required],
      creditAdjustmentValue: ['', Validators.required],
      invoiceValue: ['', Validators.required],
      asPerSwgstp: ['', Validators.required],
      asPerInvgstp: ['', Validators.required],
      asPerSwtaxable: ['', Validators.required],
      asPerInvtaxable: ['', Validators.required],
      asPerInvIgst: [],
      asPerSwIgst: [],
      asPerSwcgstAmt: [],
      asPerInvcgstAmt: [],
      asPerSwsgstAmt: [],
      asPerInvsgstAmt: [],
      remarks: []
    });
    this.loadProductData();
    this.loadSupplierData();
   
    this.loadManfacturerData();
    this.loadTaxTypeaheadData();
    this.modeType = this.sharedDataService.getSharedCommonJsonData().Mode;
    this.focusField.nativeElement.focus();
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
      this.debitAdjList = list;
      this.creditAdjList = list;
    });
  }
 
  loadManfacturerData() {
    this.masterService.getParentData('manfacturer/').subscribe(list => {
      this.manfacturerList = list;
    });
  }
 

  loadTaxTypeaheadData() {
    this.masterService.getParentData('tax/').subscribe(list => {
      this.typeaheadTaxDataList = list;
    });
  }
  onSelectProduct(event) {
    
    this.purchaseForm.patchValue({ free: event.item.free });
    this.purchaseForm.patchValue({ productId: event.item.id });
    this.purchaseForm.patchValue({ productcode: event.item.productcode });
    this.purchaseForm.patchValue({ netRate: event.item.netRate });
    this.calculateRate();
  }

  calculateRate() {
    
    this.purchaseForm.patchValue({ grossValue: this.purchaseForm.value.qty * this.purchaseForm.value.purRate });
    this.purchaseForm.patchValue({ netValue: this.purchaseForm.value.qty - this.purchaseForm.value.discount + this.purchaseForm.value.taxValue });
    this.purchaseForm.patchValue({discountValue: this.purchaseForm.value.qty * this.purchaseForm.value.qty });
    this.purchaseForm.patchValue({taxValue: this.purchaseForm.value.grossValue - this.purchaseForm.value.discountValue});
  
  }

  onSelectDebitAdjustmentLedger(event) {
      this.purchaseForm.patchValue({ drAdjLedjerId: event.item.id});
    }
  onSelectCreditAdjustmentLedger(event) {
      this.purchaseForm.patchValue({ crAdjLedjerId: event.item.id});
}

  onSelectedTaxTypeahead(event) {
  this.purchaseForm.patchValue({ taxId: event.item.id});
}

onSelectManfacturer(event){
  this.purchaseForm.patchValue({manfacturerId: event.item.id});
}


  onSelectSupplier(event) {
    if (this.savedSupplierId >= 0 && this.savedSupplierId !== event.item.id) {
      this.purchaseForm.patchValue({ suplierId: event.item.id });
      this.purchaseForm.patchValue({ gstIN: event.item.gstIN });
      this.purchaseForm.patchValue({ hsnCode: event.item.hsnCode });
      this.purchaseForm.patchValue({stateCode: event.item.stateId})
      
    }
  }
  generateOrderNo(){
    if(!this.purchaseForm.value.purchaseNumber){
      if(this.gridDataList && this.gridDataList.length == 0){
        this.purchaseForm.patchValue({ purchaseNumber: 1});
      }else{
        let orderN0 = Math.max.apply(Math, this.gridDataList.map(function(o) { return o.purchaseNumber; }))
        this.purchaseForm.patchValue({ purchaseNumber: orderN0+1});
      } 
    }        
  }
  validateState(){
    let userState = this.auth.getUserState();
    if(this.purchaseForm.value.stateCode && this.purchaseForm.value.stateCode == userState){
      return true;
    }else
    return false;
  }
  
  save() {
    this.generateOrderNo(); 
    this.savedSupplierId = this.purchaseForm.value.suplierId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

 
  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    const tempSupplierId = this.purchaseForm.value.suplierId;
    const tempSupplierName = this.purchaseForm.value.supplier;
    this.resetForm(null);
    this.purchaseForm.value.suplierIdsuplierId = tempSupplierId;
    this.purchaseForm.value.supplier = tempSupplierName;
  //  this.loadGridData();
  }

  requiredErrMsg() {
      this.formRequiredError = true;
      this.formSuccess = false;
  }

  resetForm(param) {
    const tempSupplierId = this.purchaseForm.value.suplierId;
    const tempSupplierName = this.purchaseForm.value.supplier;
    const tempOrderNum = this.purchaseForm.value.purchaseNumber;
    this.purchaseForm.reset();
    if ((param === undefined || param === null ) && !this.nameFlag) {
      this.purchaseForm.patchValue({ suplierId: tempSupplierId });
      this.purchaseForm.patchValue({ supplier: tempSupplierName });
      this.purchaseForm.patchValue({ purchaseNumber: tempOrderNum });
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
    this.purchaseForm.reset(s);
    const productObj = _.find(this.productsList, function(o) {return o.id === s.productId; });
    this.onSelectProduct({item : productObj});
  }
}