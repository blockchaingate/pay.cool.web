import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  packages: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private utilServ: UtilService,
    private projectServ: ProjectService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(
      (param: ParamMap) => {
        const id = param.get('id');
        this.projectServ.getAllProjectPackagesByProjectId(id, 100, 0).subscribe(
          packages => {
            this.packages = packages;
          }
        );
      });

  }

  showName(name) {
    return this.utilServ.showName(name);
  }
  gotoPackage(packageId: string) {
    this.router.navigate(['/project/package/' + packageId]);
  }
}
