import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-left',
  templateUrl: './left.component.html',
  styleUrls: ['./left.component.scss']
})
export class LeftComponent implements OnInit {
  page: string = 'main';
  @Input() multisigwallet: any;
  constructor() { }

  ngOnInit(): void {
  }

  onBack() {
    this.page = 'sidebar';
  }

  onBackFromSidebar() {
    this.page = 'main';
  }
}
