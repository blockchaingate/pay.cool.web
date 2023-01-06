import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { UtilService } from 'src/app/services/util.service';
import { CommonService } from 'src/app/services/common.service';
import { metaforceProjectId } from '../../config/projectId';

@Component({
  selector: 'app-metaforce-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overview: any;
  fetPrice: number;
  lpPrice: number;
  constructor(
    private utilServ: UtilService,
    private commonServ: CommonService,
    private projectServ: ProjectService) { }

  ngOnInit(): void {
    this.projectServ.getOverview(metaforceProjectId).subscribe(
      (overview: any) => {
        console.log('overview===', overview);
        this.overview = overview;
      }
    );

    this.commonServ.getPrice('FET').subscribe(
      (ret: any) => {
        console.log('ret===', ret);
        this.fetPrice = ret.price;
      }
    );

    this.commonServ.getPrice('FETDUSD-LP').subscribe(
      (ret: any) => {
        console.log('ret===', ret);
        this.lpPrice = ret.price;
      }
    );



  }

  getFetValue(amount: number) {
    return Number((this.fetPrice * amount).toFixed(4));
  }

  getLpValue(amount: number) {
    return Number((this.lpPrice * amount).toFixed(4));
  }

  showAmount(amount: any) {
    return Number(this.utilServ.showAmount(amount, 18));
  }
}
