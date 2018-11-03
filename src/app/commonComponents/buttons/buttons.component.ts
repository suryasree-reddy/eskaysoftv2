import { Component, OnInit, Input, TemplateRef, Output, ViewChild, EventEmitter, ElementRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModelDialogComponent } from '../confirmation-model-dialog/confirmation-model-dialog.component';
import { MasterService } from 'src/app/dashboard/master/master.service';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html'
})


export class ButtonsComponent implements OnInit {

  @Input() isBtnDeleteDisable: boolean = false;
  @Input() hideSaveBtn: boolean = false;
  @Input() hideDeleteBtn: boolean = false;
  @Input() hideResetBtn: boolean = false;
  @Input() deleteConfirmMsg: string = null;
  @Input() saveConfirmMsg: string = null;
  @Input() deleteInfoMsg: string = null;
  @Input() saveInfoMsg: string = null;
  @Input() formObj: any;
  @Input() title: string = null;
  @Input() duplicateMessage: string = null;
  @Input() endPoint: string = null;
  @Output() saveRecord: EventEmitter<null> = new EventEmitter();
  @Output() deleteRecord: EventEmitter<null> = new EventEmitter();
  @Output() displayErrorMessages: EventEmitter<null> = new EventEmitter();
  @Output() afterSuccess: EventEmitter<null> = new EventEmitter();
  @Output() resetForm: EventEmitter<null> = new EventEmitter();
  @Output() serverErrMsg: EventEmitter<null> = new EventEmitter();

  private displayMsg: string = null;

  constructor(
    private translate: TranslateService, private masterService: MasterService,
    private modalService: BsModalService) { translate.setDefaultLang('messages.en'); }

  ngOnInit() { }

  reset() {
    this.resetForm.emit();
  }

  saveForm() {
    if (this.formObj.valid && this.duplicateMessage == null) {
      this.showConfirmationModal("Save");
    } else {
      this.displayErrorMessages.emit();
    }
  }

  save() {
    if (this.formObj.value.id) {
      this.masterService.updateRecord(this.endPoint, this.formObj.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg.emit();
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.formObj.value).subscribe(res => {
        this.showInformationModal("Save");
      }, (error) => {
        this.serverErrMsg.emit();
      });
    }
  }

  delete() {
    this.masterService.deleteRecord(this.endPoint, this.formObj.value.id).subscribe(res => {
      localStorage.removeItem('ag-activeRow');
      this.showInformationModal("Delete");
    }, (error) => {
      this.serverErrMsg.emit();
    });
  }

  showInformationModal(eventType) {
    if (eventType === "Delete") {
      this.displayMsg = this.deleteInfoMsg;
    } else {
      this.displayMsg = this.saveInfoMsg;
    }
    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showInformationModal(
      this.title,
      this.displayMsg,
      ''
    );
    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => { this.afterSuccess.emit(); });
  }

  showConfirmationModal(eventType): void {
    if (eventType === "Delete") {
      this.displayMsg = this.deleteConfirmMsg;
      this.openConfirmDialog(eventType, this.displayMsg, this.title, 'green');
    } else {
      this.displayMsg = this.saveConfirmMsg;
      this.openConfirmDialog(eventType, this.displayMsg, this.title, 'green');
    }
  }

  openConfirmDialog(eventType, title, message, headerColor){

    const modal = this.modalService.show(ConfirmationModelDialogComponent);
    (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
      title, message, headerColor, '');

    (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
      if (eventType === "Delete") {
        this.deleteRecord.emit();
      } else {
        this.saveRecord.emit();
      }
    });
  }

  /*  showConfirmModal(eventType, displayConfMsg, displayInMsg, title, formObject, endPoint, callBack1, callBac2 ): void {
      if (eventType === "Delete") {
        this.deleteInfoMsg = displayInMsg;
        this.deleteConfirmMsg = displayConfMsg;
          this.deleteRecord = callBack1;
      }else{
        this.saveInfoMsg = displayInMsg;
        this.saveConfirmMsg = displayConfMsg;
        this.saveRecord = callBack1;
      }
      this.afterSuccess = callBac2;
      this.formObj = formObject;
      this.title= title;
      this.duplicateMessage = null;
      this.endPoint = endPoint;
      this.showConfirmationModal(eventType);
    }*/

}
