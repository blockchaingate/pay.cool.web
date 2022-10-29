import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-project-packages',
  templateUrl: './project-packages.component.html',
  styleUrls: ['./project-packages.component.scss']
})
export class ProjectPackagesComponent implements OnInit {
  projectPackages: any;
  constructor(
    private projectServ: ProjectService,
    private router: Router,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.projectServ.getAllProjectPackages(100, 0).subscribe(
      (ret: any) => {
        this.projectPackages = ret;
      }
    );
  }

  add() {
    this.router.navigate(['/admin/project-package/add']);
  }

  showName(name: any) {
    return this.utilServ.showName(name);
  }

  edit(projectId) {
    this.router.navigate(['/admin/project-package/' + projectId + '/edit']);
  }
}
