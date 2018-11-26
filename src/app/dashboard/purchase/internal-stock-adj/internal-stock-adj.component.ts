import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { TranslateService } from '@ngx-translate/core';
import { ButtonsComponent } from 'src/app/commonComponents/buttons/buttons.component';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-internal-stock-adj',
  templateUrl: './internal-stock-adj.component.html',
  styleUrls: ['./internal-stock-adj.component.scss']
})
export class InternalStockAdjComponent implements OnInit {

  private internalStockForm: FormGroup;
  private deleteFlag: boolean = true;
  private endPoint: string = "internalStockAdjustments/";
  private formSuccess: boolean = false;
  private formRequiredError: boolean = false;
  private nameFlag: boolean = false;
  private duplicateName: boolean = false;
  private duplicateMessage: string = null;
  private duplicateMessageParam: string = null;
  private internalStockList: any = [];

  @ViewChild(ButtonsComponent) buttonsComponent: ButtonsComponent;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
    translate.setDefaultLang('messages.en');

  }

  ngOnInit() {
    this.internalStockForm = this.fb.group({
      id: ['', Validators.required],
      number: ['', Validators.required],
      remarks: [],
      date: [],
      sNo: [],
      code: [],
      productName: [],
      pack: [],
      type: [],
      batch: [],
      qty: [],
      free: []
       });
  }

  checkForDuplicateName() {
    if (!this.nameFlag) {
      this.duplicateName = this.masterService.hasDataExist(this.internalStockList, 'name', this.internalStockForm.value.number);
      this.getDuplicateErrorMessages();
    }
  }



  getDuplicateErrorMessages(): void {
    if (!this.checkForDuplicateName || !this.checkForDuplicateName) {
      this.formRequiredError = false;
      this.duplicateMessage = null;
      this.duplicateMessageParam = null;
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
    this.internalStockForm.reset();
    this.deleteFlag = true;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.nameFlag = false;
    this.duplicateName = false;
    this.formRequiredError = this.formSuccess = false;
  }

}
