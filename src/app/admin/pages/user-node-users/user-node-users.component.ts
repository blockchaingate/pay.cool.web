import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from '../../../services/merchant.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-user-node-users',
  templateUrl: './user-node-users.component.html',
  styleUrls: ['./user-node-users.component.scss']
})
export class UserNodeUsersComponent implements OnInit {
  userNodeUsers: any;

  constructor(
    private router: Router, 
    private merchantServ: MerchantService,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.merchantServ.getAllNodeUsers(100, 0).subscribe(
      (nodes: any) => {
        this.userNodeUsers = nodes;
      }
    );
  }

  showAddress(exgAddress) {
    return this.utilServ.exgToFabAddress(exgAddress);
  }

}
