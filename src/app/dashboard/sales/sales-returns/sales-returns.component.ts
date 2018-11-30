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
    private suppliersList: any = [];
    private accGstType: any[];
    private modeType: any[];
  
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
      gstType: ['', Validators.required],
      salesReturnNo:['', Validators.required],
      salesReturnDate:[],
      customer: [],
      gstIN: [],
      delivTo: [],
      mode: [],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      // productcode: ['', Validators.required],
      batch: [],
      exp: [],
      qty: [],
      free: [],
      sRate: [],
      disc: [],
      // gstPerc: [],
    });
    this.accGstType = this.sharedDataService.getSharedCommonJsonData().GstType;
    this.modeType = this.sharedDataService.getSharedCommonJsonData().Mode;
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

  save() {
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
  
}
