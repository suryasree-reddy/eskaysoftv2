import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-customerwise-discount',
  templateUrl: './customerwise-discount.component.html',
})
export class CustomerwiseDiscountComponent implements OnInit {

  public customerDiscountForm: FormGroup;
  private endPoint: string = "customerwisediscount/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public customerName;
  private duplicateCustomerName: boolean = false;
  public duplicateMessage: string = null;
  public duplicateMessageParam: string = null;
  modalRef: BsModalRef;
  message: string;

  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: BsModalService,
    private masterService: MasterService) {
      translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    this.customerDiscountForm = this.fb.group({
      id: [],
      customer: ['', Validators.required],
      company: ['', Validators.required],
      discount: ['', Validators.required],

    });
    //this.loadGridData();
    this.getGridCloumsList();
    this.focusField.nativeElement.focus();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  onInitialDataLoad(dataList:any[]){
    this.gridDataList = dataList;
  }
  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    if (this.duplicateCustomerName) {
      this.duplicateMessage = "customerdiscount.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.customerDiscountForm.value.customer;
    }
  }

  checkForDuplicateCustomerName() {
        if(!this.nameFlag){
        this.duplicateCustomerName = this.masterService.hasDataExist(this.gridDataList, 'customer', this.customerDiscountForm.value.customer);
        this.getDuplicateErrorMessages();
      }

  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["CustomerDiscountColumns"];
    });
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.gridDataList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.gridDataList.length));
    });
  }

  save() {
    if (this.customerDiscountForm.valid) {

      if (this.customerDiscountForm.value.id) {
        this.masterService.updateRecord(this.endPoint, this.customerDiscountForm.value).subscribe(res => {
          this.showInformationModal("Save");
        }, (error) => {
          this.serverErrMsg();
        });
      } else {
        this.masterService.createRecord(this.endPoint, this.customerDiscountForm.value).subscribe(res => {
          this.showInformationModal("Save");
        }, (error) => {
          this.serverErrMsg();
        });
      }

    } else {
      this.requiredErrMsg()
    }
  }

  saveForm() {
    this.formRequiredError = false;
    if (this.customerDiscountForm.valid) {
      this.showConfirmationModal("Save");
    } else {
      this.serverErrMsg()
    }
  }

  delete() {

    this.masterService.deleteRecord(this.endPoint, this.gridSelectedRow.id).subscribe(res => {
      localStorage.removeItem('ag-activeRow');
      this.showInformationModal("Delete");
    }, (error) => {
      this.serverErrMsg();
    });

  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    if( this.duplicateMessage == null){
      this.formRequiredError = true;
      this.formSuccess = this.formServerError = false;
    }
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.customerDiscountForm.reset();
    this.gridSelectedRow = null;
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.customerDiscountForm.reset(s);
    this.nameFlag = true;
    this.deleteFlag = false;
  }


  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'customerdiscount.deleteInformationMessage';
      title = 'Customerwise Discount';
    } else if (eventType === "Save") {
      title = 'Customerwise Discount';
      msg = 'customerdiscount.saveInformationMessage';
    }
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      title,
      msg,
      ''
    );
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => { this.successMsg(); });
  }

  showConfirmationModal(eventType): void {
    var msg;
    var title;
    if (eventType === "Delete") {
      title = 'Customerwise Discount';
      msg = 'customerdiscount.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'Customerwise Discount';
      msg = 'customerdiscount.saveConfirmationMessage';
    }
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      title,
      msg,
      'green',
      ''
    );

    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        if (eventType === "Delete") {
          this.delete();
        } else {
          this.save();
        }
      }
    });
  }
}
