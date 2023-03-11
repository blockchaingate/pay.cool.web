import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-payreward-diff-detail',
  templateUrl: './payreward-diff-detail.component.html',
  styleUrls: ['./payreward-diff-detail.component.scss']
})
export class PayrewardDiffDetailComponent implements OnInit {

  item: any;
  constructor(private utilServ: UtilService) { }

  ngOnInit(): void {
  }

  showId(id: string) {
    if(!id) {
      return id;
    }
    return this.utilServ.showId(id);
  }

}
