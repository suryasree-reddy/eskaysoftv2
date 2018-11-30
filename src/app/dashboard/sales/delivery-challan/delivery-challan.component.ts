import { Component, OnInit, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';

@Component({
  selector: 'app-delivery-challan',
  templateUrl: './delivery-challan.component.html'
})
export class DeliveryChallanComponent implements OnInit {
  public deliveryChallanForm: FormGroup;
  public productForm: FormGroup;
  private deleteFlag: boolean = true;
  private endpoint: string ="gSTChallan/"
  private cEndPoint: string = "product/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private internalStockList: any = [];
  public gstTypeList: any = [];
  public modeList: any = [];

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
   }

   ngOnInit() {
    this.productForm = this.fb.group({
      id: [],
      taxId: [],
      companyId: [],
      productgroupId: [],
      productcategoryId: [],
      name: ['', Validators.required],
      packing: ['', Validators.required],
      boxQty: ['', Validators.required],
      productGroupName: ['', Validators.required],
      companyName: ['', Validators.required],
      caseQty: ['', Validators.required],
      productCategoryName: ['', Validators.required],
      netRate: ['', Validators.required],
      isNetRateItem: ['', Validators.required],
      schemeQty: ['', Validators.required],
      free: ['', Validators.required],
      contents: ['', Validators.required],
      tax: ['', Validators.required],
      productcode: ['', Validators.required]
    });
    this.deliveryChallanForm = this.fb.group({
      id: ['', Validators.required],
      gstType: [],
      dcNumber: [],
      dcDate: [],
      customer: [],
      gstin: [],
      deliverTo: [],
      mode: [],
      productId:[],
      productName:[],
      productcode:[],
      batch: [],
      expiry: [],
      qty:[],
      free:[],
      sRate:[],
      disc: [],
      gstp:[]
   
  });
  
  this.focusField.nativeElement.focus();
  this.gstTypeList = this.sharedDataService.getSharedCommonJsonData().GstType;
  this.modeList = this.sharedDataService.getSharedCommonJsonData().Mode;

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
  this.deliveryChallanForm.reset();
  this.deleteFlag = true;
  this.duplicateMessage = null;
  this.duplicateMessageParam = null;
  this.nameFlag = false;
  this.duplicateName = false;
  this.formRequiredError = this.formSuccess = false;
}

 
}