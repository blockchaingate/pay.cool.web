import { Component, TemplateRef, OnInit, Input, Output, EventEmitter } from '@angular/core';
import BigNumber from 'bignumber.js';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss']
})
export class FeeComponent implements OnInit {

  @Input() chain: string;
  @Output() gasPriceChange = new EventEmitter();
  @Input() gasPrice: number;

  @Output() gasLimitChange = new EventEmitter();
  @Input() gasLimit: number;

  modalRef?: BsModalRef;
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {

  }

  fee() {
    return new BigNumber(this.gasPrice).multipliedBy(new BigNumber(this.gasLimit)).shiftedBy(-9).toNumber();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  save() {
    this.gasPriceChange.emit(this.gasPrice);
    this.gasLimitChange.emit(this.gasLimit);
    this.modalRef.hide();
  }
}
