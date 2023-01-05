import { Component, OnInit } from '@angular/core';
import { LockerService } from 'src/app/services/locker.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-metaforce-lplockers',
  templateUrl: './lplocker.component.html',
  styleUrls: ['./lplocker.component.scss']
})
export class LplockerComponent implements OnInit {

  pageSize = 5;
  pageNum = 0;
  lplockers: any;
  constructor(
    private utilServ: UtilService,
    private lockerServ: LockerService) { }

  ngOnInit(): void {
    this.lockerServ.getAllLpLockers(this.pageSize, this.pageNum).subscribe(
      (lockers) => {
        this.lplockers = lockers;
      }
    );
  }

  showFabAddress(address: string) {
    return this.utilServ.exgToFabAddress(address);
  }

  changePageNum(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    this.pageNum = pageNum;
    this.lockerServ.getAllLpLockers(this.pageSize, this.pageNum).subscribe(
      (lockers) => {
        this.lplockers = lockers;
      }
    );
  }
}
