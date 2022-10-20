import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-users',
  templateUrl: './project-users.component.html',
  styleUrls: ['./project-users.component.scss']
})
export class ProjectUsersComponent implements OnInit {

  projectusers: any;
  constructor(
    private projectServ: ProjectService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.projectServ.getAllProjectUsers(100, 0).subscribe(
      (ret: any) => {
        this.projectusers = ret;
      }
    );
  }

  add() {
    this.router.navigate(['/admin/project-user/add']);
  }

}
