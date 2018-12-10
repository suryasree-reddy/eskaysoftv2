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
// import { ConfirmationModelDialogComponent } from 'src/app/commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-purchase-dashboard',
  templateUrl: './purchase-dashboard.component.html'
})

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsModalService
  ],
})

export class PurchaseDashboardComponent implements OnInit {

  public purchaseForm: FormGroup;
  private endPoint: string = "purchaseentry/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean =true;
  public duplicateMessage: string = null;
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
    private masterService: MasterService) {
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
     this.focusField.nativeElement.focus();
     this.modeType = this.sharedDataService.getSharedCommonJsonData().Mode;
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }
}
