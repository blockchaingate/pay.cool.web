import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-box',
  templateUrl: './info-box.component.html',
  styleUrls: ['./info-box.component.scss']
})
export class InfoBoxComponent implements OnInit {
  @Input() address: string;
  @Input() money: string;
  @Input() status: number;
  @Input() invitedUser: number;
  statusColor = 'red';
  constructor() { }

  ngOnInit() {
  }

  getStatusText(status: number) {
    this.statusColor = 'red';
    if(status == 0) {
      return 'PayStatus0'; // Waiting for payment
    } else
    if(status == 1) {
      return 'PayStatus1'; // Payment made
    } else
    if(status == 3) {
      this.statusColor = 'green';
      return 'PayStatus3'; // Payment confirmed
    } else
    if(status == 4) {
      this.statusColor = 'green';
      return 'PayStatus4'; // Completed
    } else
    if(status == 5) {
      return 'PayStatus5'; // Cancelled
    } else
    if(status == 6) {
      return 'PayStatus6'; // Suspended
    }
    return 'Unknown';
  }
}
