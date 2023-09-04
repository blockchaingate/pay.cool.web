import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Input() multisigwallet: any;
  @Output() onBack = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  back() {
    this.onBack.emit();
  }
}
