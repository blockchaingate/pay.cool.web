import { Component, OnInit, Input } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { metaforceProjectId } from '../../../config/projectId';

@Component({
  selector: 'app-project-user',
  templateUrl: './project-user.component.html',
  styleUrls: ['./project-user.component.scss']
})
export class ProjectUserComponent implements OnInit {
  @Input() status: number;
  pageSize = 5;
  pageNum = 0;
  users: any;

  constructor(private projectServ: ProjectService) { }

  ngOnInit(): void {
    this.projectServ.getAllUsersByProjectAndStatus(metaforceProjectId, this.status, this.pageSize, this.pageNum).subscribe(
      (rewards: any) => {
        this.users = rewards;
      }
    );
  }

  changePageNum(pageNum: number) {
    if(pageNum < 0) {
      pageNum = 0;
    }
    this.pageNum = pageNum;
    this.projectServ.getAllUsersByProjectAndStatus(metaforceProjectId, this.status, this.pageSize, this.pageNum).subscribe(
      (rewards: any) => {
        this.users = rewards;
      }
    );
  }
}
