import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {

  address: string = '0x132709492d2e50ea9EeB51e863bC664B10aD2942';
  constructor(public bsModalRef: BsModalRef) {}

  ngOnInit(): void {
  }

}
