import { Component, OnInit } from '@angular/core';
import { PayRewardService } from 'src/app/services/payreward.service';

@Component({
  selector: 'app-excess',
  templateUrl: './excess.component.html',
  styleUrls: ['./excess.component.scss', '../../../table.scss']
})
export class ExcessComponent implements OnInit {

  excesses: any;
  totalReward: number;
  totalLp: number;
  constructor(private payRewardServ: PayRewardService) { }

  ngOnInit(): void {
    this.totalReward = 0;
    this.totalLp = 0;
    this.payRewardServ.getExcesses(10000, 0).subscribe(
      (excesses: any) => {
        this.excesses = excesses;
        for(let i = 0; i < excesses.length; i++) {
          const item = excesses[i];
          const category = item.category;
          if(category == 'reward') {
            this.totalReward += item.amount;
          } else {
            this.totalLp += item.amount;
          }
          
        }
      }
    );
  }
}
