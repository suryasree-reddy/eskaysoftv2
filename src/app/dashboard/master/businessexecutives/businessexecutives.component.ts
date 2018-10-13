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
  selector: 'app-businessexecutives',
  templateUrl: './businessexecutives.component.html'
})
export class BusinessexecutivesComponent implements OnInit {

  public businessExecutiveForm: FormGroup;
  private endPoint: string = "businessexecutive/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public busiExecNum;
  private duplicateBusExecName: boolean = false;
  private duplicateBusExecNum: boolean = false;
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
    this.businessExecutiveForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      address: ['', Validators.required],
      town: ['', Validators.required],
      mobile: ['', Validators.required]
    });
    this.loadGridData();
    this.getGridCloumsList();
    this.focusField.nativeElement.focus();
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  validateFormOnBlur() {
    this.formRequiredError = false;
    if (this.busiExecNum != this.businessExecutiveForm.value.mobile) {
      this.duplicateBusExecNum = this.masterService.hasDataExist(this.gridDataList, 'mobile', parseInt(this.businessExecutiveForm.value.mobile));
      this.getDuplicateErrorMessages();
    }
  }

  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.formRequiredError = false;
    if (this.duplicateBusExecName && this.duplicateBusExecNum) {
      this.duplicateMessage = "businessexecutive.duplicateErrorMessage";

    } else if (this.duplicateBusExecNum) {
      this.duplicateMessage = "businessexecutive.duplicateIndexErrorMessage";
      this.duplicateMessageParam = this.businessExecutiveForm.value.mobile;

    } else if (this.duplicateBusExecName) {
      this.duplicateMessage = "businessexecutive.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.businessExecutiveForm.value.name;
    }
  }

  checkForDuplicateBusiExecName() {
    this.duplicateBusExecName = this.masterService.hasDataExist(this.gridDataList, 'name', this.businessExecutiveForm.value.name);
    this.getDuplicateErrorMessages();
  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["BusinessExecutiveColumns"];
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
    if (this.businessExecutiveForm.value.id != null) {
      this.masterService.updateRecord(this.endPoint, this.businessExecutiveForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.businessExecutiveForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  saveForm() {
    this.formRequiredError = false;
    if (this.businessExecutiveForm.valid && this.duplicateMessage == null) {
      this.showConfirmationModal("Save");
    } else {
      this.requiredErrMsg()
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
    if (this.duplicateMessage == null) {
    this.formRequiredError = true;
    this.formSuccess = this.formServerError = false;
    }
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.businessExecutiveForm.reset();
    this.gridSelectedRow = null;
    this.duplicateMessage = null
    this.nameFlag = false;
    this.deleteFlag = true;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.businessExecutiveForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.deleteFlag = false;
    this.nameFlag = true;
  }


  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'businessexecutive.deleteInformationMessage';
      title = 'Business Executive';
    } else if (eventType === "Save") {
      title = 'Business Executive';
      msg = 'businessexecutive.saveInformationMessage';
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
      title = 'Business Executive';
      msg = 'businessexecutive.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'Business Executive';
      msg = 'businessexecutive.saveConfirmationMessage';
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
