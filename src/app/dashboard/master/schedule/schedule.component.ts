import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ConfirmationModelDialogComponent } from '../../../commonComponents/confirmation-model-dialog/confirmation-model-dialog.component';

//import { SynectiksCommonGridComponent } from '../../../commonComponents/synectiks-common-grid/synectiks-common-grid.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  private endPoint: string = "schedules/";
  public scheduleTypes: any = [];
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public scheduleList: any = [];
  public scheduleListColumns;
  public editSchedule;
  public deleteFlag: boolean =true;
  public saveBtnFlag: boolean =false;
  public duplicateSchIndex: boolean = false;
  public nameFlag;
  public gridDataList: Observable<any[]>;
  public lastSchIndex;
  modalRef: BsModalRef;
  @ViewChild('focus') focusField: ElementRef;
  private saveConfirmationMessage:string = "Are you sure you want to save Schedule?";
  private deleteConfirmationMessage:string = "Are you sure you want to delete Schedule?";

  constructor(private fb: FormBuilder, private modalService: BsModalService, private translate: TranslateService, private masterService: MasterService) {
    translate.setDefaultLang('messages.en');
  }

  valueChange(selectedRow: any[]): void {
    this.editable(selectedRow);
  }

  ngOnInit() {
    this.scheduleForm = this.fb.group({
      id: [],
      scheduleName: ['', Validators.required],
      scheduleIndex: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });

    this.loadGridData();
    this.focusField.nativeElement.focus();
    this.getScheduleTypes();
  }

  validateFormOnBlur() {
      this.formRequiredError=false;
      var schIndex = this.scheduleForm.value.scheduleIndex;
      if(this.lastSchIndex != schIndex){
        let duplcateIndex = this.masterService.hasDataExist(this.scheduleList, 'scheduleIndex', schIndex);
         if (schIndex != "" && duplcateIndex) {
            this.duplicateSchIndex =true;
          }else{
              this.duplicateSchIndex =false;
          }
      }else{
        this.duplicateSchIndex =false;
      }
    }

  loadGridData() {

  //  this.gridDataList = this.masterService.gridDataList;
  //  this.masterService.getDataNew(this.endPoint).subscribe();
  //  console.log("New this.gridDataList-", this.gridDataList);

    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.scheduleList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.scheduleList.length));
    });
  }

  getScheduleTypes() {
    this.masterService.getLocalJsonData().subscribe(data => {
       data as object [];
        this.scheduleTypes =data["ScheduleTypes"];
        this.scheduleListColumns = data["ScheduleListColumns"]
    });
  }

validateFormOnSave():boolean{
  if (this.scheduleForm.valid && !this.duplicateSchIndex) {
    return true;
  }else {
    this.requiredErrMsg();
      return false;
  }
}

  save(){
    if (this.scheduleForm.value.id) {
      this.masterService.updateRecord(this.endPoint, this.scheduleForm.value).subscribe(res => {
        this.successMsg();
      }, (error) => {
        this.serverErrMsg();
      });
    } else {
      this.masterService.createRecord(this.endPoint, this.scheduleForm.value).subscribe(res => {
        this.successMsg();
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  saveForm() {
    if (this.scheduleForm.valid && !this.duplicateSchIndex) {
      this.showConfirmationModal('Save');
    } else {
      this.requiredErrMsg()
    }
  }

  delete() {
      this.masterService.deleteRecord(this.endPoint, this.editSchedule.id).subscribe(res => {
        localStorage.removeItem('ag-activeRow');
        this.successMsg()
      }, (error) => {
        this.serverErrMsg();
      });

  }

  showConfirmationModal(eventType): boolean {
    var msg;
      if(eventType === "Delete"){
        msg =this.deleteConfirmationMessage;
      }else{
        msg =this.saveConfirmationMessage;
      }
       const modal = this.modalService.show(ConfirmationModelDialogComponent);
       (<ConfirmationModelDialogComponent>modal.content).showConfirmationModal(
           'Schedule',
           msg
       );

       (<ConfirmationModelDialogComponent>modal.content).onClose.subscribe(result => {
          if (result) {
             if(eventType === "Delete"){
               this.delete();
             }else{
               this.save();
             }
          }
       });
   }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    if(!this.duplicateSchIndex ){
      this.formRequiredError = true;
      this.formSuccess = this.formServerError = false;
    }

  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.scheduleForm.reset();
    this.editSchedule = null;
    this.deleteFlag = true;
    this.saveBtnFlag = false;
    this.duplicateSchIndex=false;
    this.nameFlag = false;
    this.lastSchIndex;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.formRequiredError=false;
    this.editSchedule = s;
    this.scheduleForm.reset(s);
    this.lastSchIndex = this.editSchedule.scheduleIndex;
    this.saveBtnFlag = this.deleteFlag = !this.editSchedule.deleteFlag;
    this.duplicateSchIndex=false;
    this.nameFlag = true;
  }

}
