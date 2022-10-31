import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';
import { UtilService } from '../services/util.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projects: any;
  constructor(
    private router: Router,
    private utilServ: UtilService,
    private projectServ: ProjectService) { }

  ngOnInit(): void {
    this.projectServ.getAllProjects(100, 0).subscribe(
      (projects: any) => {
        this.projects = projects;
      }
    );
  }

  showName(name: any) {
    return this.utilServ.showName(name);
  }

  gotoPackages(projectId: string) {
    this.router.navigate(['/project/' + projectId + '/packages']);
  }
}
