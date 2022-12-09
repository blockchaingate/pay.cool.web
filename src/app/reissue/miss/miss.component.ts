import { Component, OnInit } from '@angular/core';
import { PayRewardService } from 'src/app/services/payreward.service';

@Component({
  selector: 'app-miss',
  templateUrl: './miss.component.html',
  styleUrls: ['./miss.component.scss', '../../../table.scss']
})
export class MissComponent implements OnInit {
  
  misses: any;
  totalReward: number;
  totalLp: number;
  constructor(private payRewardServ: PayRewardService) { }

  ngOnInit(): void {
    this.totalReward = 0;
    this.totalLp = 0;
    this.payRewardServ.getMisses(10000, 0).subscribe(
      (misses: any) => {
        this.misses = misses;
        for(let i = 0; i < misses.length; i++) {
          const item = misses[i];
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
