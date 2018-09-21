import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubscheduleService } from './subschedule.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ScheduleService } from 'src/app/dashboard/master/schedule/schedule.service';


@Component({
  selector: 'app-subschedule',
  templateUrl: './subschedule.component.html',
  styleUrls: ['./subschedule.component.scss']
})
export class SubscheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  public subScheduleForm: FormGroup;
  public formRequiredError: boolean = false; 
  public formServerError: boolean = false;
  public formSuccess: boolean = false;
  subScheduleList: any = [];
  scheduleList: any = [];
  editSubSchedule: any;
  public selectedSchedule: any;
  @ViewChild('focus') focusField: ElementRef;

  private gridApi;
  private rowSelection;
  private gridColumnApi;
  public subScheduleListColumns = [
    { headerName: 'Sub-Schedule Name', field: 'subScheduleName' },
    { headerName: 'Schedule Id', field: 'scheduleId', filter: "agNumberColumnFilter"  },
    { headerName: 'Sub-Schedule Index', field: 'subScheduleIndex', filter: "agNumberColumnFilter"  }
    
  ];

  scheduleTypes: any;
  modalRef: BsModalRef;
  message: string;

  constructor(private fb: FormBuilder,
    private subScheduleService: SubscheduleService,
    private modalService: BsModalService,
    private scheduleService: ScheduleService) { }


  ngOnInit() {
    this.scheduleForm = this.fb.group({
      id: [],
      scheduleName: ['', Validators.required],
      scheduleIndex: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });


    this.subScheduleForm = this.fb.group({
      subScheduleId: [],
      subScheduleName: ['', Validators.required],
      subScheduleIndex: ['', Validators.required],
      scheduleId: [],
      scheduleName: []
    });

    this.subScheduleService.getAll();
    this.subScheduleService.subSchedules.subscribe(list => {
      this.subScheduleList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.scheduleList.length));
    })

    this.subScheduleService.getAllSchedules().subscribe(res => {
      this.scheduleList = res;
    })

    this.focusField.nativeElement.focus();
    this.getScheduleTypes();
    this.rowSelection = "single";

  }

  onSelectSchedule(event){
    this.selectedSchedule = event.item;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md'});
  }
 
  getScheduleTypes() {
    this.scheduleTypes = [{
      "code": "ASS",
      "description": "Assets"
    }, {
      "code": "LIA",
      "description": "Liabilities"
    }, {
      "code": "TRADE",
      "description": "Trading"
    }, {
      "code": "PNL",
      "description": "Profit & Loss"
    }]
  }

  saveSchedule() {
    if (this.scheduleForm.valid) {
      this.scheduleService.createSchedule(this.scheduleForm.value).subscribe(res => {
        this.subScheduleService.getAllSchedules().subscribe(res => {
          this.scheduleList = res;
        });
        this.scheduleForm.reset();
        this.modalRef.hide();
        
      }, (error) => {
        this.formServerError = true;
      });
      
    } else {
      this.formRequiredError = true;
    }

  }

  resetScheduleForm(){
    this.scheduleForm.reset();
  }


  save() {
    this.formRequiredError = false;

    if (this.subScheduleForm.valid && this.selectedSchedule && this.selectedSchedule.id) {
      this.subScheduleForm.value.scheduleId = this.selectedSchedule.id;
      console.log(this.subScheduleForm.value);
      if(this.subScheduleForm.value.subScheduleId){
        this.subScheduleService.update(this.subScheduleForm.value).subscribe(res => {
          this.subScheduleService.getAll();
          this.formSuccess = true;
          this.focusField.nativeElement.focus();
        }, (error) => {
          this.formServerError = true;
        });
      }else{
        this.subScheduleService.create(this.subScheduleForm.value).subscribe(res => {
          this.subScheduleService.getAll();
          this.formSuccess = true;
          this.focusField.nativeElement.focus();
        }, (error) => {
          this.formServerError = true;
        });
      }
      this.resetForm();
      
    } else {
      this.formRequiredError = true;
    }

  }

  resetForm(){
    this.subScheduleForm.reset();
    this.editSubSchedule = null;
  }
  editable(s){
    this.editSubSchedule = s;
    this.selectedSchedule = {};
    this.selectedSchedule.id = s.scheduleId;
    this.subScheduleForm.reset(s); 
  }

  delete(){
    this.subScheduleService.delete( this.editSubSchedule.subScheduleId ).subscribe(res => {
      this.subScheduleService.getAll();
      this.formSuccess = true;
      this.focusField.nativeElement.focus();
    }, (error) => {
      this.formServerError = true;
    });
    this.resetForm();
    localStorage.removeItem('ag-activeRow');
  }


  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.editable(selectedRows[0]);
    localStorage.setItem('ag-activeRow', JSON.stringify(selectedRows[0]));
    let selectedRowsString = "";
    selectedRows.forEach(function(selectedRow, index) {
      if (index !== 0) {
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.scheduleName;
    });
  }


  navigateToNextCell(params){
    // const selectedRows= params.key;
    let previousCell = params.previousCellDef;
    const suggestedNextCell = params.nextCellDef;

    const KEY_UP = 38;
    const KEY_DOWN = 40;

    const nxt = suggestedNextCell.column.gridApi;
    localStorage.setItem('ag-curCell', '0');
    
    switch(params.key){
      case KEY_DOWN:
        const nextRowIndex = suggestedNextCell.rowIndex;
        localStorage.setItem('ag-nxtCell', JSON.stringify(nextRowIndex));

        nxt.forEachNode((node) => {
          let curCell = parseInt(localStorage.getItem('ag-curCell'), 10);

          if(''+curCell === localStorage.getItem('ag-nxtCell')){
            localStorage.setItem('ag-activeRow', JSON.stringify(node.data));
            node.setSelected(true);
            
          }
          curCell = curCell + 1;
          localStorage.setItem('ag-curCell', curCell.toString());
        });

        if(nextRowIndex <= 0){
          return null;
        } else {
          return suggestedNextCell;
        }

      case KEY_UP:
        // const nextRowIndex = suggestedNextCell.rowIndex;
        localStorage.setItem('ag-nxtCell', JSON.stringify(suggestedNextCell.rowIndex));

        nxt.forEachNode((node) => {
          let curCell = parseInt(localStorage.getItem('ag-curCell'), 10);

          if(''+curCell === localStorage.getItem('ag-nxtCell')){
            localStorage.setItem('ag-activeRow', JSON.stringify(node.data));
            node.setSelected(true);
            
          }
          curCell = curCell + 1;
          localStorage.setItem('ag-curCell', curCell.toString());
        });

        previousCell = params.previousCellDef;
        // set selected cell on current cell -1

        const prevRowIndex = previousCell.rowIndex - 1;
        const renderedRowCount = parseInt(localStorage.getItem('rowDataLength'), 10);
        if(prevRowIndex >= renderedRowCount){
          return null
        } else {
          return suggestedNextCell;
        }

      
      default: 
        throw 'ag-grid has gone away';
      
    }



  }



  fun(){
    this.editable(JSON.parse(localStorage.getItem('ag-activeRow')));
  }

  onGridReady(params){
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
    // this.gridColumnApi = params.columnApi;
    const columns = params.columnApi.getAllDisplayedVirtualColumns();

    columns.forEach((column) => {
      const ele = document.querySelector('div.ag-body-container');

      ele.addEventListener('keydown', (e) => {
        if(e['key'] === 'Enter'){
          this.fun();
        }
      });
    });


  }


}
