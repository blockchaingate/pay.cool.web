import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-user-node-users',
  templateUrl: './user-node-users.component.html',
  styleUrls: ['./user-node-users.component.scss']
})
export class UserNodeUsersComponent implements OnInit {
  userNodeUsers: any;

  constructor(
    private userServ: UserService,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.userServ.getAllNodeUsers(100, 0).subscribe(
      (nodes: any) => {
        this.userNodeUsers = nodes;
      }
    );
  }

  showAddress(exgAddress) {
    return this.utilServ.exgToFabAddress(exgAddress);
  }

}
