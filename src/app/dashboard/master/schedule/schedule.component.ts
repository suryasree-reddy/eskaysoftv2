import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from './schedule.service';
import { ViewChild } from '@angular/core';
import { Column } from 'ag-grid-community';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  public scheduleForm: FormGroup;
  public scheduleTypes: any = [];
  public formRequiredError: boolean = false; 
  public formServerError: boolean = false;

  @ViewChild('focus') focusField: ElementRef;
  public deleteFlag: boolean = true;
  public nameFlag: boolean = false;

  public searchBy: string;
  public scheduleList: any = [];
  public scheduleListColumns = [
    { headerName: 'Schedule Name', field: 'scheduleName' },
    { headerName: 'Schedule Index', field: 'scheduleIndex', filter: "agNumberColumnFilter" },
    { headerName: 'Schedule Type', field: 'scheduleType' },
    { headerName: 'Delete Status', field: 'deleteFlag', cellRenderer: 'deltaIndicator'   }
  ];
  public componentProvider = {
    deltaIndicator: this.deltaIndicator
  }
  editSchedule: any;



  private gridApi;
  private gridColumnApi;
  private rowSelection;
 
 
  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) { }


  ngOnInit() {
    this.scheduleForm = this.fb.group({
      id: [],
      scheduleName: ['', Validators.required],
      scheduleIndex: ['', Validators.required],
      scheduleType: ['', Validators.required],
    });

    this.scheduleService.getAllSchedules();
    this.scheduleService.schedules.subscribe(list => {
      this.scheduleList = list;
      localStorage.setItem('rowDataLength', JSON.stringify(this.scheduleList.length));
    })

    this.searchBy = this.scheduleListColumns[0].field;
    this.focusField.nativeElement.focus();
    this.getScheduleTypes();

    this.rowSelection = "single";

  }
  
  deltaIndicator(params) {
    var element = document.createElement("span");
    var imageElement = document.createElement("img");

    // visually indicate if this months value is higher or lower than last months value
    if (params.value) {
        imageElement.src = "assets/images/right.jpg"
    } else {
        imageElement.src = "assets/images/cancel.jpg"
    }
    element.appendChild(imageElement);
    // element.appendChild(document.createTextNode(params.value));
    return element;
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


  save() {
    if (this.scheduleForm.valid) {
      if(this.scheduleForm.value.id){
        this.scheduleService.updateSchedule(this.scheduleForm.value).subscribe(res => {
          this.scheduleService.getAllSchedules();
          this.resetForm();
        }, (error) => {
          this.formServerError = true;
        });
      }else{
        this.scheduleService.createSchedule(this.scheduleForm.value).subscribe(res => {
          this.scheduleService.getAllSchedules();
          this.resetForm();
        }, (error) => {
          this.formServerError = true;
        });
      }
      
    } else {
      this.formRequiredError = true;
    }

  }

  resetForm(){
    this.scheduleForm.reset();
    this.editSchedule = null;
    this.deleteFlag = true;
    this.nameFlag = false;
    this.focusField.nativeElement.focus();
  }
  editable(s){
    this.editSchedule = s;
    this.scheduleForm.reset(s); 
    this.deleteFlag = !this.editSchedule.deleteFlag;
    this.nameFlag = true;
  }

  delete(){
    this.scheduleService.deleteSchedule( this.editSchedule.id ).subscribe(res => {
      this.scheduleService.getAllSchedules();
      this.resetForm();
      localStorage.removeItem('ag-activeRow');
    }, (error) => {
      this.formServerError = true;
    });
    
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
    // this.gridColumnApi = params.columnApi;

    params.api.sizeColumnsToFit();

    const columns = params.columnApi.getAllDisplayedVirtualColumns();
    // const colIds = columns.map((Column) => {
    //   return columns.colId;
    // });

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


