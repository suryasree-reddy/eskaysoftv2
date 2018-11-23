import { Component, OnInit, TemplateRef, ViewChild, ElementRef} from '@angular/core';
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
  private endPoint: string = "purchase-order/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateUserName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private internalStockList: any = [];

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
      supplier: [],
      remarks: [],
      date: [],
      productId:[],
      productName:[],
      productcode:[],
      pack:[],
      qty:[],
      rate:[],
      free:[],
      value:[],
      bQty:[],
      bFree:[],
      bRate:[],
  });
  // this.focusField.nativeElement.focus();
}


// checkForDuplicateName() {
//   if (!this.nameFlag) {
//     this.duplicateName = this.masterService.hasDataExist(this.internalStockList, 'name', this.purchaseOrderForm.value.number);
//     this.getDuplicateErrorMessages();
//   }
// }



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
  this.duplicateName = false;
  this.formRequiredError = this.formSuccess = false;
}
}
