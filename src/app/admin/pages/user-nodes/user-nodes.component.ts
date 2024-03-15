import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/services/merchant.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-user-nodes',
  templateUrl: './user-nodes.component.html',
  styleUrls: ['./user-nodes.component.scss']
})
export class UserNodesComponent implements OnInit {
  merchantNodes: any;

  constructor(
    private router: Router, 
    private merchantServ: MerchantService,
    private utilServ: UtilService
  ) { }

  ngOnInit(): void {
    this.merchantServ.getAllNodes(100, 0).subscribe(
      (nodes: any) => {
        this.merchantNodes = nodes;
      }
    );
  }

  add() {
    this.router.navigate(['/admin/merchant-node/add']);
  }
  showAddress(exgAddress) {
    return this.utilServ.exgToFabAddress(exgAddress);
  }
  showType(type: number) {
    let text = '';
    switch(type) {
      case 0:
        text = 'Senior';
        break;
      case 1:
        text = 'Intermediate';
        break;
      case 2: 
        text = 'Junior';
        break;
    }
    return text;
  }
}
