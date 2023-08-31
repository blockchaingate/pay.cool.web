import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import BigNumber from 'bignumber.js';

@Component({
  selector: 'app-create-confirm',
  templateUrl: './create-confirm.component.html',
  styleUrls: ['./create-confirm.component.scss']
})
export class CreateConfirmComponent implements OnInit {
  @Input() chain: string;
  @Input() name: string;
  @Input() owners: any;
  @Input() confirmations: number;
  @Input() gasPrice: number;
  @Input() gasLimit: number;
  @Output() stepUpdated = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  back() {
    this.stepUpdated.emit(-1);
  }

  next() {
    this.stepUpdated.emit(1);
  }

  fee() {
    return new BigNumber(this.gasPrice).multipliedBy(new BigNumber(this.gasLimit)).shiftedBy(-9).toNumber();
  }
}
