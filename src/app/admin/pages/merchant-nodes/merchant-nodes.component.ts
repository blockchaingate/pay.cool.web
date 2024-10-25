import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/services/merchant.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-merchant-nodes',
  templateUrl: './merchant-nodes.component.html',
  styleUrls: ['./merchant-nodes.component.scss']
})
export class MerchantNodesComponent implements OnInit {
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
