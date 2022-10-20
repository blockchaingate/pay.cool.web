import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  
  tabName: string;
  constructor(
    ) { }

  ngOnInit(): void {
    this.tabName = 'payments';

  }

  changeTabName(name: string) {
    this.tabName = name;
  }
}
