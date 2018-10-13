import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-errormessages',
  templateUrl: './errormessages.component.html'
})
export class ErrormessagesComponent implements OnInit {

  @Input() formRequiredError: boolean = false;
  @Input() formServerError: boolean = false;
  @Input() formSuccess: boolean = false;
  @Input() duplicateMessage: string = null;
  @Input() duplicateMessageParam: string = null;

  constructor(private translate: TranslateService) { translate.setDefaultLang('messages.en');}

  ngOnInit() {
  }

}
