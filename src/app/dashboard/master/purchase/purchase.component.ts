import { Component, OnInit, TemplateRef, ViewChild, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html'
})
export class PurchaseComponent implements OnInit {

  public purchaseForm: FormGroup;
  private endPoint: string = "purchase/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean =true;
  public duplicateMessage: string = null;

  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder, private translate: TranslateService, private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }


  ngOnInit() {

    this.purchaseForm = this.fb.group({
      id: [],
      purchaseNumber: ['', Validators.required],
      invoiceNumber:[],
      date: ['', Validators.required],
      gstin: ['', Validators.required],
      wayBill: ['', Validators.required],
      transport: ['', Validators.required],
      numberOfCases: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      mode: ['', Validators.required],
      lrNumber: ['', Validators.required],
      lrDate: ['', Validators.required],
      delvFrom: ['', Validators.required],
      productCode: ['', Validators.required],
      productName: ['', Validators.required],
      batch:[],
      expiry:[],
      qty:[],
      othCharges:[],
      grsValue:[],
      discount:[],
      ptd:[],
      saleRate:[],
      tax:[],
      hsn:[],
      mrp:[],
      mfgName:[],
      purRate:[],
      free:[],
      grossValue:[],
      discountValue:[],
      taxValue:[],
      netValue:[],
      debitAdjustmentLedger:[],
      CreditAdjustmentLedger:[],
      remarks:[],
      DebitAdjustmentValue:[],
      creditAdjustmentValue:[],
      invoiceValue:[],

      gstPercent:[],
      taxable:[],
      cgstAmt:[],
      sgstAmt:[],
      inGstPercent:[],
      inTaxable:[],
      inCgstAmt:[],
      inSgstAmt:[],

    });
    // this.loadGridData();
    // this.getGridCloumsList();
    // this.focusField.nativeElement.focus();
  }
  }


