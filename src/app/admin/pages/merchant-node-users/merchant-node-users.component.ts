import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from '../../../services/merchant.service';
import { UtilService } from '../../../services/util.service';

@Component({
  selector: 'app-merchant-node-users',
  templateUrl: './merchant-node-users.component.html',
  styleUrls: ['./merchant-node-users.component.scss']
})
export class MerchantNodeUsersComponent implements OnInit {
  merchantNodeUsers: any;

  constructor( 
    private merchantServ: MerchantService,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.merchantServ.getAllNodeUsers(100, 0).subscribe(
      (nodes: any) => {
        this.merchantNodeUsers = nodes;
      }
    );
  }

  showAddress(exgAddress) {
    return this.utilServ.exgToFabAddress(exgAddress);
  }

}
