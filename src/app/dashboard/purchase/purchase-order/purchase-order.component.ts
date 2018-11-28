import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {

  public purchaseOrderForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "purchaseOrder/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateOrderNo: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private purchaseOrderList: any = [];
  private productsList: any = [];
  private suppliersList: any = [];

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.purchaseOrderForm = this.fb.group({
      id: ['', Validators.required],
      orderNumber: ['', Validators.required],
      supplier: ['', Validators.required],
      remarks: ['', Validators.required],
      date: ['', Validators.required],
      productId: ['', Validators.required],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],
      pack: ['', Validators.required],
      qty: ['', Validators.required],
      rate: ['', Validators.required],
      free: ['', Validators.required],
      value: ['', Validators.required],
      bQty: ['', Validators.required],
      bFree: ['', Validators.required],
      bRate: ['', Validators.required]
    });
    this.loadProductData();
    this.loadSupplierData();
  }

  checkForDuplicateOrderNo() {
    if (!this.nameFlag) {
      this.duplicateOrderNo = this.masterService.hasDataExist(this.purchaseOrderList, 'orderNumber', this.purchaseOrderForm.value.orderNumber);
      this.getDuplicateErrorMessages();
    }
  }

  loadProductData() {
    this.masterService.getParentData("product/").subscribe(list => {
      this.productsList = list;
    });
  }

  loadSupplierData() {
    this.masterService.getParentData("accountinformation/").subscribe(list => {
      this.suppliersList = list;
    });
  }
  
  getDuplicateErrorMessages(): void {
    if (!this.duplicateOrderNo) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
    }
    if (this.duplicateOrderNo) {
      this.duplicateMessage = "purchaseOrder.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.purchaseOrderForm.value.orderNumber;
    }

  }


  // getDuplicateErrorMessages(): void {
  //   if (!this.checkForDuplicateName || !this.checkForDuplicateName) {
  //     this.formRequiredError = false;
  //     this.duplicateMessage = null;
  //     this.duplicateMessageParam = null;
  //   }
  // }

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
    this.purchaseOrderForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateOrderNo = false;
    this.formRequiredError = this.formSuccess = false;
  }
}
