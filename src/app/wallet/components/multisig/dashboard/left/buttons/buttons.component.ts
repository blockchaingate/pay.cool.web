import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { ReceiveComponent } from '../../receive/receive.component';
@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss']
})
export class ButtonsComponent implements OnInit {

  bsModalRef?: BsModalRef;
  constructor(private modalService: BsModalService) {}

  ngOnInit(): void {
  }

  openReceiveModal() {
    const initialState: ModalOptions = {
      initialState: {
        
      }
    };
    this.bsModalRef = this.modalService.show(ReceiveComponent, initialState);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
}
