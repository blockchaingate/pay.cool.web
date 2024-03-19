import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-user-node-links',
  templateUrl: './user-node-links.component.html',
  styleUrls: ['./user-node-links.component.scss']
})
export class UserNodeLinksComponent implements OnInit {
  merchantNodeLinks: any;

  constructor(
    private router: Router, 
    private userServ: UserService,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.userServ.getAllNodeLinks(100, 0).subscribe(
      (nodes: any) => {
        this.merchantNodeLinks = nodes;
      }
    );
  }

  add() {
    this.router.navigate(['/admin/user-node-link/add']);
  }
  
  showStatus(status) {
    return Math.floor(status / 8);
  }
}
