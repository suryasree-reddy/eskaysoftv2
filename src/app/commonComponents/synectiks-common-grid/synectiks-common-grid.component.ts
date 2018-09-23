import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Column } from 'ag-grid-community';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-synectiks-common-grid',
  templateUrl: './synectiks-common-grid.component.html',
  styleUrls: ['./synectiks-common-grid.component.scss']
})
export class SynectiksCommonGridComponent implements OnInit {


  @Input() rowSelection;
  @Input() gridDataList: any = [];
  @Input() gridColumnList: any = [];
  @Input() deleteFlag: boolean = true;
  @Input() searchBy: string;

  @Output() valueChange = new EventEmitter();

  private gridApi;
  private gridColumnApi;
  private rowSelection;

  public selectedRow: any[];
  @ViewChild('focus') focusField: ElementRef;

  public componentProvider = {
    deltaIndicator: this.deltaIndicator
  }

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    translate.setDefaultLang('messages.en');
  }

  ngOnInit() {
    //  this.searchBy = this.gridColumnList[0].field;
    //this.focusField.nativeElement.focus();
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

  onSelectionChanged() {
    const selectedRows = this.gridApi.getSelectedRows();
    this.valueChange.emit(selectedRows[0]);
    localStorage.setItem('ag-activeRow', JSON.stringify(selectedRows[0]));
    let selectedRowsString = "";
    selectedRows.forEach(function(selectedRow, index) {
      if (index !== 0) {
        selectedRowsString += ", ";
      }
      selectedRowsString += selectedRow.scheduleName;
    });
  }

  navigateToNextCell(params) {
    let previousCell = params.previousCellDef;
    const suggestedNextCell = params.nextCellDef;
    const KEY_UP = 38;
    const KEY_DOWN = 40;
    if (suggestedNextCell != null) {
      const nxt = suggestedNextCell.column.gridApi;
      localStorage.setItem('ag-curCell', '0');
      switch (params.key) {
        case KEY_DOWN:
          const nextRowIndex = suggestedNextCell.rowIndex;
          localStorage.setItem('ag-nxtCell', JSON.stringify(nextRowIndex));

          nxt.forEachNode((node) => {
            let curCell = parseInt(localStorage.getItem('ag-curCell'), 10);

            if ('' + curCell === localStorage.getItem('ag-nxtCell')) {
              localStorage.setItem('ag-activeRow', JSON.stringify(node.data));
              node.setSelected(true);

            }
            curCell = curCell + 1;
            localStorage.setItem('ag-curCell', curCell.toString());
          });

          if (nextRowIndex <= 0) {
            return null;
          } else {
            return suggestedNextCell;
          }

        case KEY_UP:
          // const nextRowIndex = suggestedNextCell.rowIndex;
          localStorage.setItem('ag-nxtCell', JSON.stringify(suggestedNextCell.rowIndex));

          nxt.forEachNode((node) => {
            let curCell = parseInt(localStorage.getItem('ag-curCell'), 10);

            if ('' + curCell === localStorage.getItem('ag-nxtCell')) {
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
          if (prevRowIndex >= renderedRowCount) {
            return null
          } else {
            return suggestedNextCell;
          }
        default:
          throw 'ag-grid has gone away';
      }
    }



  }

  fun() {
    this.editable(JSON.parse(localStorage.getItem('ag-activeRow')));
  }

  onGridReady(params) {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();

    const columns = params.columnApi.getAllDisplayedVirtualColumns();
    columns.forEach((column) => {
      const ele = document.querySelector('div.ag-body-container');

      ele.addEventListener('keydown', (e) => {
        if (e['key'] === 'Enter') {
          this.fun();
        }
        if (e['key'] === 'Tab') {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });
    });
  }

}
