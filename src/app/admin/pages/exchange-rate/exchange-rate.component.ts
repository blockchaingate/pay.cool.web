import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CoinService } from '../../../services/coin.service';
import { KanbanService } from '../../../services/kanban.service';
import { Web3Service } from '../../../services/web3.service';
import { environment } from 'src/environments/environment';
import { coins } from '../../../config/coins';
@Component({
  selector: 'app-exchange-rate',
  templateUrl: './exchange-rate.component.html',
  styleUrls: ['./exchange-rate.component.css', '../../../../table2.scss']
})
export class ExchangeRateComponent implements OnInit {
  coin_list: any;
  constructor(
    private kanbanServ: KanbanService,
    private web3Serv: Web3Service,
    
    private router: Router,
    private coinServ: CoinService) { }

  ngOnInit(): void {
    this.coin_list = coins.map(item => {return {name: item, rate:0}});
    this.coin_list.forEach(async coin => {
      const coinName = coin.name;
      const rate = await this.getRate(coinName);
      coin['rate'] = rate;
    });
  }

  async getRate(coinName: string) {
    const to = environment.addresses.smartContract.exchangeRate2;
    const coinId = this.coinServ.getCoinTypeIdByName(coinName);
    const abi = {
      "constant": true,
      "inputs": [
        {
          "name": "_token",
          "type": "uint32"
        }
      ],
      "name": "getExchangeRate",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    };
    const args = [coinId];
    const abiData = this.web3Serv.getGeneralFunctionABI(abi, args);
    const ret = await this.kanbanServ.kanbanCallAsync(to, abiData);
    const data = ret.data;
    const rate = parseInt(data, 16) / 1e8;
    return rate;
  }

  editExchangeRate(coin) {
    this.router.navigate(['/admin/exchange-rate/' + coin.name + '/edit'],{ queryParams: {
      rate: coin.rate,
    }});
  }
}
