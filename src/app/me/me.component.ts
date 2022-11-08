import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  
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
