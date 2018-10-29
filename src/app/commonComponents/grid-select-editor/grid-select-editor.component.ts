import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";


@Component({
  selector: 'app-grid-select-editor',
  template: '<select #input  (keydown)="onKeyDown($event)" name="value" (change)="onCellValueChanged($event)" [(ngModel)]="value.key" style="width: 100%"> <option *ngFor="let selectedValue of value" [value]="selectedValue.key">{{selectedValue.key}} </option> </select>'
})
export class GridSelectEditorComponent implements ICellEditorAngularComp,  AfterViewInit {
    private params: any;
    public value: any = [];

    @ViewChild('input', {read: ViewContainerRef}) public input;

    agInit(params: any): void {
        console.log("this.params--", params.values);
        this.params = params;
        this.value = params.values;
    }

    getValue(): any[] {
        return this.value;
    }
    
    onKeyDown(event): void {
            if (event.preventDefault) event.preventDefault();
    }

    onCellValueChanged(event): void {
          console.log("event-----", event.target.value);
    }
    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

}
