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
  selector: 'app-bankinformation',
  templateUrl: './bankinformation.component.html'
})
export class BankinformationComponent implements OnInit {

  public bankInformationForm: FormGroup;
  private endPoint: string = "bankinformation/";
  public gridDataList: any = [];
  public gridColumnNamesList;
  public gridSelectedRow;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public nameFlag;
  public deleteFlag: boolean = true;
  public bankName;
  private duplicateBankName: boolean = false;
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
    this.bankInformationForm = this.fb.group({
      id: [],
      name: ['', Validators.required],
      address: ['', Validators.required]
    });
    //this.loadGridData();
    this.getGridCloumsList();
    this.focusField.nativeElement.focus();
  }

  onInitialDataLoad(dataList:any[]){
    this.gridDataList = dataList;
  }
  
  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  getDuplicateErrorMessages(): void {
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    this.formRequiredError = false;
    if (this.duplicateBankName) {
      this.duplicateMessage = "bankinfo.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.bankInformationForm.value.name;
    }
  }

  checkForDuplicateBankName() {
      if(!this.nameFlag){
        this.duplicateBankName = this.masterService.hasDataExist(this.gridDataList, 'name', this.bankInformationForm.value.name);
        this.getDuplicateErrorMessages();
      }
  }

  getGridCloumsList() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.gridColumnNamesList = data["BankInformationColumns"];
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
    if (this.bankInformationForm.value.id) {
      this.masterService.updateRecord(this.endPoint, this.bankInformationForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.bankInformationForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  saveForm() {
    this.formRequiredError = false;
    if (this.bankInformationForm.valid && this.duplicateMessage == null) {
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
    this.bankInformationForm.reset();
    this.gridSelectedRow = null;
    this.duplicateMessage = null;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.deleteFlag = true;
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.gridSelectedRow = s;
    this.bankInformationForm.reset(s);
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
    this.deleteFlag = false;
  }


  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'bankinfo.deleteInformationMessage';
      title = 'Bank Information';
    } else if (eventType === "Save") {
      title = 'Bank Information';
      msg = 'bankinfo.saveInformationMessage';
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
      title = 'Bank Information';
      msg = 'bankinfo.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'Bank Information';
      msg = 'bankinfo.saveConfirmationMessage';
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
