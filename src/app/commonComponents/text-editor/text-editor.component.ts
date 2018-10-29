import {Component, ViewContainerRef, ViewChild, AfterViewInit} from '@angular/core';

import {ICellEditorAngularComp} from 'ag-grid-angular/main';
@Component({
    selector: 'editor-cell',
    template: '<input #input (keydown)="onKeyDown($event)" [(ngModel)]="value">'
})
export class TextEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    private params: any;
    public value: any;


    @ViewChild('input', {read: ViewContainerRef}) public input;


    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;
    }

    getValue(): any {

        return this.value;
    }

     onKeyDown(event): void {
       this.value = event.target.value;
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
       // this.input.element.nativeElement.focus();
    }


}
