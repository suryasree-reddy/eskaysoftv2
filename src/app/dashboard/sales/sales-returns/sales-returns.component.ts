import { Component, OnInit, TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

@Component({
  selector: 'app-sales-returns',
  templateUrl: './sales-returns.component.html'
})
export class SalesReturnsComponent implements OnInit {

    public salesReturnForm: FormGroup;
    private deleteFlag: boolean = true;
    private endPoint: string = "salesRetruns/";
    private formSuccess: boolean = false;
    private formRequiredError: boolean = false;
    private nameFlag: boolean = false;
    private duplicateName: boolean = false;
    private duplicateSaleRetNo: boolean = false;
    private duplicateMessage: string = null;
    private duplicateMessageParam: string = null;
    private salesReturnList: any = [];
    private productsList: any = [];
    private customersList: any = [];
    private accGstType: any[];
    private modeType: any[];
    public gridDataList: any = [];
    private savedCustomerId = 0;

    @ViewChild('focus') focusField: ElementRef;
    @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;
  
   constructor(private fb: FormBuilder,
      private translate: TranslateService,
      private sharedDataService: SharedDataService,
      private masterService: MasterService) {
      translate.setDefaultLang('messages.en'); }

  ngOnInit() {
    this.salesReturnForm  = this.fb.group({
      id: [],
      salesReturnNo:['', Validators.required],
      salesReturnDate:[],
      gstType: ['', Validators.required],
      accountInformationId: ['', Validators.required],
      customer: [],
      remarks: ['', Validators.required],
      gstIN: [],
      delivTo: [],
      mode: [],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      free: [],
      batch: [],
      expiry: [],
      qty: [],
      sRate: [],
      disc: ['', Validators.required],
      gstp: ['', Validators.required]
         });
    this.accGstType = this.sharedDataService.getSharedCommonJsonData().GstType;
    this.modeType = this.sharedDataService.getSharedCommonJsonData().Mode;
    this.loadCustomerData();
    this.loadProductData();
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

  

  checkForDuplicateSaleRetNo() {
    if (!this.nameFlag) {
      this.duplicateSaleRetNo = this.masterService.hasDataExist(this.salesReturnList, 'salesReturnNo', this.salesReturnForm.value.salesReturnNo);
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    if (!this.duplicateSaleRetNo) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateSaleRetNo) {
      this.duplicateMessage = "salesReturn.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.salesReturnForm.value.salesReturnNo;
    }
  }
  onSelectProduct(event) {

    this.salesReturnForm.patchValue({ free: event.item.free });

    this.salesReturnForm.patchValue({ productId: event.item.id });
    this.salesReturnForm.patchValue({ netRate: event.item.netRate });
    this.salesReturnForm.patchValue({ productcode: event.item.productcode });

  }
  onSelectCustomer(event) {
   
    if (this.savedCustomerId >= 0 && this.savedCustomerId !== event.item.id) {
      this.salesReturnForm.patchValue({ accountInformationId: event.item.id });
      this.salesReturnForm.patchValue({gstIN: event.item.gstIN});
      this.salesReturnForm.patchValue({ salesReturnNo: this.gridDataList.length + 1 });
      
    }
  }
  calculateRate() {
    this.salesReturnForm.patchValue({ sRate: this.salesReturnForm.value.qty * this.salesReturnForm.value.qty });
  
  }
  save() {
    this.savedCustomerId = this.salesReturnForm.value.accountInformationId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }
  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm() {
    this.salesReturnForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateSaleRetNo = false;
    this.formRequiredError = this.formSuccess = false;
  }
  editable(s) {
    this.nameFlag = true;
    this.formRequiredError = false;
   
    this.deleteFlag = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.salesReturnForm.reset(s);

  }

}
