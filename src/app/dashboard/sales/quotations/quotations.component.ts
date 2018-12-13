import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

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
  private duplicateName: boolean = false;
  private duplicateOrderNo: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private quotationList: any = [];
  private productsList: any = [];
  private customersList: any = [];

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
      id: ['', Validators.required],
      orderNumber: ['', Validators.required],
      accountInformationId: ['', Validators.required],
      customer: ['', Validators.required],
      remarks: [],
      date: [],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],
      pack: [],
      qty: [],
      rate: [],
      amount: [],
    });
    this.loadProductData();
    this.loadCustomerData();
  }

  checkForDuplicateOrderNo() {
    if (!this.nameFlag) {
      this.duplicateOrderNo = this.masterService.hasDataExist(this.quotationList, 'orderNumber', this.quotationForm.value.orderNumber);
      this.getDuplicateErrorMessages();
    }
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
    this.quotationForm.patchValue({ pack: event.item.packing });
    this.quotationForm.patchValue({ free: event.item.free });

  }
  onSelectCustomer(event) {
   
      this.quotationForm.patchValue({ accountInformationId: event.item.id });
   
    }
  

  getDuplicateErrorMessages(): void {
    if (!this.duplicateOrderNo) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateOrderNo) {
      this.duplicateMessage = "quotation.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.quotationForm.value.orderNumber;
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
    this.quotationForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateOrderNo = false;
    this.formRequiredError = this.formSuccess = false;
  }

}
