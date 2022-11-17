import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { UtilService } from 'src/app/services/util.service';
import { statuses } from '../../../config/statuses';

@Component({
  selector: 'app-project-users',
  templateUrl: './project-users.component.html',
  styleUrls: ['./project-users.component.scss']
})
export class ProjectUsersComponent implements OnInit {
  projects: any;
  statuses = statuses;
  projectusers: any;
  constructor(
    private projectServ: ProjectService,
    private utilServ: UtilService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.projectServ.getAllProjects(100,0).subscribe(
      projects => this.projects = projects
    );
    this.projectServ.getAllProjectUsers(100, 0).subscribe(
      (ret: any) => {
        this.projectusers = ret;
      }
    );
  }

  showProjectName(projectId) {
    if(this.projects && this.projects.length > 0) {
      const projects = this.projects.filter(item => item.id == projectId);
      if(projects && projects.length > 0) {
        return this.utilServ.showName(projects[0].name);
      }
    }
    return '';
  }

  showStatus(status) {
    const statuses = this.statuses.filter(item => item.value == status);
    if(statuses && statuses.length > 0) {
      return statuses[0].text;
    }
    return '';
  }
  add() {
    this.router.navigate(['/admin/project-user/add']);
  }

}
