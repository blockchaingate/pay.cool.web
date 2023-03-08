import { Component, OnInit } from '@angular/core';
import { InsightService } from 'src/app/services/insight.service';

@Component({
  selector: 'app-fet',
  templateUrl: './fet.component.html',
  styleUrls: ['./fet.component.scss']
})
export class FetComponent implements OnInit {
  fromSeed: any;
  fromMetaforce: any;
  constructor(private insightServ: InsightService) { }

  ngOnInit(): void {
    this.insightServ.getFetRewardsFromSeed().subscribe(
      ret => {
        this.fromSeed = ret;
      }
    );

    this.insightServ.getFetRewardsFromMetaforce().subscribe(
      ret => {
        this.fromMetaforce = ret;
      }
    );
  }

  showReward(rewards: number) {
    return Math.round(rewards);
  }
}
