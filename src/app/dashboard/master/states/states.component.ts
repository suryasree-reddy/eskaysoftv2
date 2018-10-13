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
  selector: 'app-states',
  templateUrl: './states.component.html'
})
export class StatesComponent implements OnInit {

  public statesForm: FormGroup;
  private endPoint: string = "states/";
  private prevStateCode: string  = null;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public statesList: any = [];
  public statesListColumns;
  public editStates;
  public deleteFlag: boolean = true;
  public saveBtnFlag: boolean = false;
  public nameFlag;
  public stateName;
  private duplicateStateName: boolean = false;
  private duplicateStateCode: boolean = false;
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

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  ngOnInit() {
    this.statesForm = this.fb.group({
      id: [],
      stateName: ['', Validators.required],
      stateCode: ['', Validators.required],
      zone: ['', Validators.required],
    });
    this.loadGridData();
    this.focusField.nativeElement.focus();
    this.getStatesTypes();
  }

  getDuplicateErrorMessages(): void {
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.duplicateMessageParam = null;
    if (this.duplicateStateName) {
      this.duplicateMessage = "states.duplicateNameErrorMessage";
      this.duplicateMessageParam = this.statesForm.value.stateName;
    } else if (this.duplicateStateCode) {
      this.duplicateMessage = "states.duplicateCodeErrorMessage";
      this.duplicateMessageParam = this.statesForm.value.stateCode;
    }
  }

  checkForDuplicateStateName() {
    if(!this.nameFlag){
      this.duplicateStateName = this.masterService.hasDataExist(this.statesList, 'stateName', this.statesForm.value.stateName);
      if (this.duplicateStateName) {
        const temp = this.statesForm.value.stateName;
        const stateObj = _.filter(this.statesList, function(o) { return o.stateName.toLowerCase() == temp.toLowerCase() });
        this.statesForm.patchValue({ stateCode: stateObj[0].stateCode })
        this.statesForm.patchValue({ zone: stateObj[0].zone })
      }
      this.getDuplicateErrorMessages();
    }

  }

  checkForDuplicateStateCode() {
    this.duplicateStateCode = false;
    if(this.prevStateCode != this.statesForm.value.stateCode){
      this.duplicateStateCode = this.masterService.hasDataExist(this.statesList, 'stateCode', parseInt(this.statesForm.value.stateCode));
    }
      this.getDuplicateErrorMessages();
  }

  loadGridData() {
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.statesList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.statesList.length));
    });
  }

  getStatesTypes() {
    this.masterService.getLocalJsonData().subscribe(data => {
      data as object[];
      this.statesListColumns = data["StateListColumns"]
    });
  }

  saveState() {
    this.formRequiredError = false;
    if (this.statesForm.valid && this.duplicateMessage == null) {
      this.showConfirmationModal("Save");
    } else {
      this.requiredErrMsg()
    }
  }

  save() {
    if (this.statesForm.value.id) {
      this.masterService.updateRecord(this.endPoint, this.statesForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.statesForm.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  delete() {
    this.masterService.deleteRecord(this.endPoint, this.editStates.id).subscribe(res => {
      this.showInformationModal("Delete");
      localStorage.removeItem('ag-activeRow');
      this.successMsg()
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
    this.statesForm.reset();
    this.duplicateStateName = false;
    this.duplicateStateCode = false;
    this.editStates = null;
    this.prevStateCode = null;
    this.deleteFlag = true;
    this.saveBtnFlag = false;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editStates = s;
    this.prevStateCode =  s.stateCode
    this.statesForm.reset(s);
    this.saveBtnFlag = this.deleteFlag = !this.editStates.deleteFlag;
    this.formRequiredError = false;
    this.duplicateMessage = null;
    this.nameFlag = true;
  }

  showInformationModal(eventType) {
    var msg;
    var title;
    if (eventType === "Delete") {
      msg = 'states.deleteInformationMessage';
      title = 'State';
    } else if (eventType === "Save") {
      title = 'State';
      msg = 'states.saveInformationMessage';
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
      title = 'State';
      msg = 'states.deleteConfirmationMessage';
    } else if (eventType === "Save") {
      title = 'State';
      msg = 'states.saveConfirmationMessage';
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
