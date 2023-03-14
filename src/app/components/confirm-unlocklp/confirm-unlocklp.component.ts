import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-confirm-unlocklp',
  templateUrl: './confirm-unlocklp.component.html',
  styleUrls: ['./confirm-unlocklp.component.scss']
})
export class ConfirmUnlocklpComponent implements OnInit {
  public onClose: Subject<boolean>;
  constructor(private bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.onClose = new Subject();
  }

  close() {
    this.onClose.next(false);
    this.bsModalRef.hide();
  }

  confirm() {
    this.onClose.next(true);
    this.bsModalRef.hide();
  }
}
