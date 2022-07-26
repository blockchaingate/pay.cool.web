import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-transfer-ownership',
    templateUrl: './transfer-ownership.component.html',
    styleUrls: ['./transfer-ownership.component.scss']
  })
  export class TransferOwnershipComponent implements OnInit {
      address: string;
      public onClose: Subject<string>;
      constructor(private modalRef: BsModalRef) {}
      ngOnInit(): void {
        this.onClose = new Subject();
      }
      close() {
        this.modalRef.hide();
      }
      confirm() {
        this.onClose.next(this.address);
        this.modalRef.hide();
      }
  }