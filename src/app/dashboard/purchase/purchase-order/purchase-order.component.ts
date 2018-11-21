import { Component, OnInit, TemplateRef, ViewChild, ElementRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';
import 'src/assets/styles/mainstyles.scss';
import * as _ from 'lodash';

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
      orderNumber: [],
      supplier: [],
      remarks: [],
      date: [],
      sNo:[],
      bank:[],
      transport:[],
      productId:[],
      productName:[],
      productcode:[],
      pack:[],
      qty:[],
      free:[],
      rate:[],
      bQty:[],
      bFree:[],
      bRate:[],
  });
  this.focusField.nativeElement.focus();
}

}
