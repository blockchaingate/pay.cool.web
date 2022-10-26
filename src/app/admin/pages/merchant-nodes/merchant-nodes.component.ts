import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/services/merchant.service';

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

  showType(type: number) {
    let text = '';
    switch(type) {
      case 2:
        text = 'Senior';
      case 1:
        text = 'Intermediate';
      case 0: 
        text = 'Junior';
    }
    return text;
  }
}
