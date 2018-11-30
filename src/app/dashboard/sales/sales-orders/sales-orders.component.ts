import { Component, OnInit, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';


@Component({
  selector: 'app-sales-orders',
  templateUrl: './sales-orders.component.html',
 
})
export class SalesOrdersComponent implements OnInit {


  public salesOrderForm: FormGroup;
  private deleteFlag: boolean = true;
  private endpoint: string ="salesOrder/"
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private internalStockList: any = [];
  public rateTypeList: any = [];
 

  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
   }

  ngOnInit() {
    this.salesOrderForm = this.fb.group({
      id: ['', Validators.required],
      orderNumber: ['', Validators.required],
      date: [],
      customer: [],
      rateType:[],
      remarks: [],
      productId:[],
      productName:[],
      productcode:[],
      packing:[],
      qty:[],
      free:[],
      rate:[],
      value:[],
     
     
  });
  
  this.focusField.nativeElement.focus();
  this.rateTypeList = this.sharedDataService.getSharedCommonJsonData().RateType;
 

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
  this.salesOrderForm.reset();
  this.deleteFlag = true;
  this.duplicateMessage = null;
  this.duplicateMessageParam = null;
  this.nameFlag = false;
  this.duplicateName = false;
  this.formRequiredError = this.formSuccess = false;
}

 
}