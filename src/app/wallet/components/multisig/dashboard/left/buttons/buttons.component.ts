import { Component, OnInit, Input } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ReceiveComponent } from '../../receive/receive.component';
@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {
  @Input() multisigwallet: any;
  bsModalRef?: BsModalRef;
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
  }

  openReceiveModal() {

    /*
    const initialState: ModalOptions = {
      initialState: {
        title: 'Modal with component'
      }
    };
    this.bsModalRef = this.modalService.show(ReceiveComponent, initialState);
    */

    /*
    const initialState: ModalOptions = {
      initialState: {
        list: [
          'Open a modal with component',
          'Pass your data',
        ],
        title: 'Modal with component'
      }
    };
    this.bsModalRef = this.modalService.show(ReceiveComponent, initialState);
    */

    const initialState = {
      multisigwallet: this.multisigwallet
    };

    this.bsModalRef = this.modalService.show(ReceiveComponent, { initialState });

    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
