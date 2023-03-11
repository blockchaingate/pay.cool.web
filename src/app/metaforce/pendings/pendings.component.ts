import { Component, OnInit } from '@angular/core';
import { PayRewardService } from 'src/app/services/payreward.service';


@Component({
  selector: 'app-payreward-pendings',
  templateUrl: './pendings.component.html',
  styleUrls: ['./pendings.component.scss']
})
export class PendingsComponent implements OnInit {
    pendings: any;
    constructor(private payRewardServ: PayRewardService) {}
    ngOnInit(): void {
        this.payRewardServ.getAllPendings().subscribe(
            (ret: any) => {
                this.pendings = ret;
            }
        );
    }
}