import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html'
})
export class CompaniesComponent implements OnInit {

  public deleteFlag: boolean =true;
  constructor() { }

  ngOnInit() {
  }

}
