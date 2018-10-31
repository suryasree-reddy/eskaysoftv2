import { Component, OnInit } from '@angular/core';
import '../assets/styles/mainstyles.scss';
import { MasterService } from 'src/app/dashboard/master/master.service';
import { SharedDataService } from 'src/app/shared/model/shared-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  title = 'eskaysoft';

  constructor(
    private sharedDataService: SharedDataService,
    private masterService: MasterService) {
  }

  ngOnInit() {
    this.masterService.getLocalJsonData().subscribe(data => {
      this.sharedDataService.setSharedCommonJsonData(data as object[]);
    });
  }


}
