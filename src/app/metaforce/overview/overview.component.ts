import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { UtilService } from 'src/app/services/util.service';
import { metaforceProjectId } from '../../config/projectId';

@Component({
  selector: 'app-metaforce-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  overview: any;
  constructor(
    private utilServ: UtilService,
    private projectServ: ProjectService) { }

  ngOnInit(): void {
    this.projectServ.getOverview(metaforceProjectId).subscribe(
      (overview: any) => {
        console.log('overview===', overview);
        this.overview = overview;
      }
    );
  }

  showAmount(amount: any) {
    return Number(this.utilServ.showAmount(amount, 18));
  }
}
