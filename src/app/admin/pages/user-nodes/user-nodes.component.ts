import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-user-nodes',
  templateUrl: './user-nodes.component.html',
  styleUrls: ['./user-nodes.component.scss']
})
export class UserNodesComponent implements OnInit {
  userNodes: any;

  constructor(
    private router: Router, 
    private userServ: UserService,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.userServ.getAllNodes(100, 0).subscribe(
      (nodes: any) => {
        this.userNodes = nodes;
      }
    );
  }

  add() {
    this.router.navigate(['/admin/user-node/add']);
  }

  showAddress(exgAddress) {
    return this.utilServ.exgToFabAddress(exgAddress);
  }

  showType(type: number) {
    let text = '';
    switch(type) {
      case 0:
        text = 'Global';
        break;
      case 1:
        text = 'National';
        break;
      case 2: 
        text = 'Regional';
        break;
    }
    return text;
  }
}
