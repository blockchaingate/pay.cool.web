import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: any;
  constructor(
    private projectServ: ProjectService,
    private router: Router,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.projectServ.getAllProjects(100, 0).subscribe(
      (ret: any) => {
        this.projects = ret;
      }
    );
  }

  add() {
    this.router.navigate(['/admin/project/add']);
  }

  showName(name: any) {
    return this.utilServ.showName(name);
  }

  edit(projectId) {
    this.router.navigate(['/admin/project/' + projectId + '/edit']);
  }
}
