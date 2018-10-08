import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-confirmation-model-dialog',
  templateUrl: './confirmation-model-dialog.component.html',
  styleUrls: ['./confirmation-model-dialog.component.scss']
})


export class ConfirmationModelDialogComponent   implements OnInit {
    public active: boolean = false;
    public activeInformation: boolean = false;
    public body: string;
    public title: string;
    public onClose: Subject<boolean>;

    public constructor(
        private _bsModalRef: BsModalRef
    ) { }

    public ngOnInit(): void {
        this.onClose = new Subject();
    }

    public showConfirmationModal(title: string, body: string): void {
        this.title = title;
        this.body =  body;
        this.active = true;
    }

    public showInformationModal(title: string, body: string): void {
        this.title = title;
        this.body =  body;
        this.activeInformation = true;
    }

    public onConfirm(): void {
        this.active = false;
        this.onClose.next(true);
        this._bsModalRef.hide();
    }

    public onCancel(): void {
        this.active = false;
        this.activeInformation = false;
        this.onClose.next(false);
        this._bsModalRef.hide();
    }

    public hideConfirmationModal(): void {
        this.active = false;
        this.onClose.next(null);
        this._bsModalRef.hide();
    }
}
