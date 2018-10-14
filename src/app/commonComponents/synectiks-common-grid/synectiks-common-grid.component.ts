import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { MasterService } from 'src/app/dashboard/master/master.service';

@Component({
  selector: 'app-synectiks-common-grid',
  templateUrl: './synectiks-common-grid.component.html'
})
export class SynectiksCommonGridComponent implements OnInit {

  @Input() rowSelection;
  @Input() gridDataList: any = [];
  @Input() endPoint : string;
  @Input() gridColumnList: any = [];
  @Output() valueChange = new EventEmitter();  
  @Output() intialLoad = new EventEmitter(); 
  private rowModelType;

  private gridApi = null;
  private gridColumnApi = null;

  public componentProvider = {
    deltaIndicator: this.deltaIndicator
  }

  constructor(private masterService: MasterService) { 
   
  }

  ngOnInit() {
    this.rowModelType = "infinite";
    this.rowSelection = "single";
    this.gridColumnList = null;
    this.gridDataList = null;
  }
  redrawAllRows() {    
    this.gridApi.RefreshView();
  }
  deltaIndicator(params) {
    var element = document.createElement("span");
    var imageElement = document.createElement("img");
    if (params.value) {
      imageElement.src = "assets/images/right.jpg"
    } else {
      imageElement.src = "assets/images/cancel.jpg"
    }
    element.appendChild(imageElement);
    return element;
  }

  onSelectionChanged() {
    this.valueChange.emit(this.gridApi.getSelectedRows()[0]);
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
              //  localStorage.setItem('ag-activeRow', JSON.stringify(node.data));
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
              //localStorage.setItem('ag-activeRow', JSON.stringify(node.data));
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

loadGridColumns(params){
  const columns = params.columnApi.getAllDisplayedVirtualColumns();
  /*columns.forEach((column) => {
    const ele = document.querySelector('div.ag-body-container');

    ele.addEventListener('keydown', (e) => {
      if (e['key'] === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  });*/
}

  onGridReady(params) {   
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    // if your data is set on the gridOptions,
    //below code for settimeout gridReady get's called before data is bound.
    // so waiting time out for 5 sec
    setTimeout(this.loadGridColumns(params), 5000);
    this.masterService.getData(this.endPoint);
    this.masterService.dataObject.subscribe(list => {
      this.intialLoad.emit(list);
      let dataSource = {
        rowCount: null, // behave as infinite scroll
        getRows: function (params) {
            console.log('asking for ' + params.startRow + ' to ' + params.endRow);
            // At this point in your code, you would call the server, using $http if in AngularJS 1.x.
            // To make the demo look real, wait for 500ms before returning
            setTimeout(function () {
                // take a slice of the total rows
                let dataAfterSortingAndFiltering = sortAndFilter(list, params.sortModel, params.filterModel);
                let rowsThisPage = dataAfterSortingAndFiltering.slice(params.startRow, params.endRow);
                // if on or after the last page, work out the last row.
                let lastRow = -1;
                if (dataAfterSortingAndFiltering.length <= params.endRow) {
                    lastRow = dataAfterSortingAndFiltering.length;
                }
                // call the success callback
                params.successCallback(rowsThisPage, lastRow);
            }, 500);
        }
      };
      params.api.setDatasource(dataSource);
      localStorage.setItem('rowDataLength', JSON.stringify(list.length));
    });
    
  }

  

}
function sortAndFilter(allOfTheData, sortModel, filterModel) {
  
  return sortData(sortModel, filterData(filterModel, allOfTheData));
}

function sortData(sortModel, data) {
  var sortPresent = sortModel && sortModel.length > 0;
  if (!sortPresent) {
    return data;
  }
  var resultOfSort = data.slice();
  resultOfSort.sort(function(a, b) {
    for (var k = 0; k < sortModel.length; k++) {
      var sortColModel = sortModel[k];
      var valueA = a[sortColModel.colId];
      var valueB = b[sortColModel.colId];
      if (valueA == valueB) {
        continue;
      }
      var sortDirection = sortColModel.sort === "asc" ? 1 : -1;
      if (valueA > valueB) {
        return sortDirection;
      } else {
        return sortDirection * -1;
      }
    }
    return 0;
  });
  return resultOfSort;
}

function filterData(filterModel, data) {
  var filterPresent = filterModel && Object.keys(filterModel).length > 0;
  if (!filterPresent) {
    return data;
  }
  var resultOfFilter = data;
  for (var i = 0; i < Object.keys(filterModel).length; i++) {
    var colName = Object.keys(filterModel)[i];    
    resultOfFilter = filterSearch(colName, filterModel, resultOfFilter);  
    
  }
  return resultOfFilter;
}

function filterSearch(colName, filterModel, tempFilter) {
  var resultOfFilter = [];
  for (var i = 0; i < tempFilter.length; i++) {
    var item = tempFilter[i];
    if (filterModel[colName]) {
      var itemName = item[colName];
      if (filterModel[colName].type == "contains") {
        if (!itemName.includes(filterModel[colName].filter)) {
          continue;
        }
      } else {
        var allowedAge = filterModel[colName].filter;
        if (filterModel[colName].type == "equals") {
          if (itemName !== allowedAge) {
            continue;
          }
        } else if (filterModel[colName].type == "lessThan") {
          if (itemName >= allowedAge) {
            continue;
          }
        } else {
          if (itemName <= allowedAge) {
            continue;
          }
        }
      }

    }
    resultOfFilter.push(item);
  }
  return resultOfFilter;
}