import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-internal-stock-adj',
  templateUrl: './internal-stock-adj.component.html'
})
export class InternalStockAdjComponent implements OnInit {

  private internalStockForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "internalStockAdjustments/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;

  private duplicateMessage: string = null;

  private internalStockList: any = [];
  private productsList: any = [];
  public gridDataList: any = [];
  public typeList: any = [];
  private duplicateNumber = false;
  private savedProductId = 0;
  public typeDataList: any = [];


  @ViewChild('focus') focusField: ElementRef;
  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');

  }

  ngOnInit() {
    this.internalStockForm = this.fb.group({
      id: [],
      number: [],
      remarks: [],
      date: ['', Validators.required],
      productId: [],
      productName: ['', Validators.required],
      productcode: ['', Validators.required],
      pack: [],
      type: ['', Validators.required],
      batch: ['', Validators.required],
      qty: ['', Validators.required],
      free: ['', Validators.required]

    });
    this.loadProductData();
    this.typeList = this.sharedDataService.getSharedCommonJsonData().Type;
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

  loadProductData() {
    this.masterService.getParentData('product/').subscribe(list => {
      this.productsList = list;
    });
  }

onSelectProduct(event) {
    this.internalStockForm.patchValue({ pack: event.item.packing });
    this.internalStockForm.patchValue({ free: event.item.free });
    this.internalStockForm.patchValue({ productId: event.item.id });
    this.internalStockForm.patchValue({ productcode: event.item.productcode });


  }
  generateNumber() {
    if (!this.internalStockForm.value.number) {
      if (this.gridDataList && this.gridDataList.length == 0) {
        this.internalStockForm.patchValue({ number: 1 });
      } else {
        let orderN0 = Math.max.apply(Math, this.gridDataList.map(function (o) { return o.number; }))
        this.internalStockForm.patchValue({ number: orderN0 + 1 });
      }
    }
  }
save() {
    this.generateNumber();
    this.savedProductId = this.internalStockForm.value.productId;
    this.buttonsComponent.save();
  }

  delete() {
    this.buttonsComponent.delete();
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = false;
    this.resetForm(null);
    this.loadGridData();
  }

  requiredErrMsg() {
    if (this.duplicateMessage == null) {
      this.formRequiredError = true;
      this.formSuccess = false;
    }
  }

  resetForm(param) {
    const tempOrderNum = this.internalStockForm.value.number;
    const tempDate = this.internalStockForm.value.date;
    const tempRemarks = this.internalStockForm.value.remarks;
    this.internalStockForm.reset();
    if ((param === undefined || param === null) && !this.nameFlag) {
      this.internalStockForm.patchValue({ number: tempOrderNum });
      this.internalStockForm.patchValue({ date: tempDate });
      this.internalStockForm.patchValue({ remarks: tempRemarks });
    }

    this.deleteFlag = true;
    this.duplicateMessage = null;

    this.nameFlag = false;
    this.duplicateNumber = false;
    this.formRequiredError = this.formSuccess = false;
    this.loadGridData();
  }

  editable(s) {
    this.nameFlag = true;
    this.formRequiredError = false;
     this.deleteFlag = false;
    this.duplicateMessage = null;

    this.internalStockForm.reset(s);
     }
}
