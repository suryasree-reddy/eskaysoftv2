import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MasterService } from '../master.service';
import '../../../../assets/styles/mainstyles.scss';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html'
})
export class StatesComponent implements OnInit {

  public statesForm: FormGroup;
  public formSuccess: boolean = false;
  public formRequiredError: boolean = false;
  public formServerError: boolean = false;
  public statesList: any = [];
  public statesListColumns;
  public editStates;
  public deleteFlag: boolean =true;
  public saveBtnFlag: boolean =false;
  public nameFlag;


  @ViewChild('focus') focusField: ElementRef;

  constructor(private fb: FormBuilder, private translate: TranslateService, private masterService: MasterService) {
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

  loadGridData() {
    this.masterService.getData("states/");
    this.masterService.dataObject.subscribe(list => {
      this.statesList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.statesList.length));
    });
  }

  getStatesTypes() {
    this.masterService.getLocalJsonData().subscribe(data => {
       data as object [];
        this.statesListColumns = data["StateListColumns"]
    });
  }

  save() {
    if (this.statesForm.valid) {
      if (confirm('Are you sure!!')) {
        if (this.statesForm.value.id) {
          this.masterService.updateRecord('states/', this.statesForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        } else {
          this.masterService.createRecord('states/', this.statesForm.value).subscribe(res => {
            this.successMsg();
          }, (error) => {
            this.serverErrMsg();
          });
        }
      }
    } else {
      this.requiredErrMsg()
    }
  }

  delete() {
    if (confirm('Are you sure!!')) {
      this.masterService.deleteRecord('states/', this.editStates.id).subscribe(res => {
        localStorage.removeItem('ag-activeRow');
        this.successMsg()
      }, (error) => {
        this.serverErrMsg();
      });
    }
  }

  successMsg() {
    this.formSuccess = true;
    this.formRequiredError = this.formServerError = false;
    this.resetForm();
  }

  requiredErrMsg() {
    this.formRequiredError = true;
    this.formSuccess = this.formServerError = false;
  }

  serverErrMsg() {
    this.formServerError = true;
    this.formRequiredError = this.formSuccess = false;
  }

  resetForm() {
    this.statesForm.reset();
    this.editStates = null;
    this.deleteFlag = true;
    this.saveBtnFlag = false;
    this.nameFlag = false;
    this.formRequiredError = this.formServerError = this.formSuccess = false;
    this.loadGridData();
    this.focusField.nativeElement.focus();
  }

  editable(s) {
    this.editStates = s;
    this.statesForm.reset(s);
    this.saveBtnFlag = this.deleteFlag = !this.editStates.deleteFlag;
    this.nameFlag = true;
  }
}
