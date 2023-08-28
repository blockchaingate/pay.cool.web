import { Component,OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-network-select',
  templateUrl: './network-select.component.html',
  styleUrls: ['./network-select.component.scss']
})
export class NetworkSelectComponent implements OnInit {
  @Output() chainChange = new EventEmitter();
  @Input() chain: string;
  constructor() { }

  ngOnInit(): void {
  }

  changeChain(chain: string) {
    this.chain = chain;
  }

  showName(chain: string) {
    let name = '';
    switch(chain) {
      case 'KANBAN':
        name = 'KANBAN chain';
        break;
      case 'FAB':
        name = 'FAB chain';
        break;
      case 'ETH': 
        name = 'Ethereum chain';
        break;   
      case 'BNB': 
        name = 'BNB chain';
        break;               
    }
    return name;
  }
}
