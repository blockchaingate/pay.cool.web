import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import BigNumber from 'bignumber.js';
import { KanbanService } from 'src/app/services/kanban.service';
import { StarService } from 'src/app/services/star.service';
import { UtilService } from 'src/app/services/util.service';
import { Web3Service } from 'src/app/services/web3.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchant-credit',
  templateUrl: './merchant-credit.component.html',
  styleUrls: ['./merchant-credit.component.scss']
})
export class MerchantCreditComponent implements OnInit {
  merchant_credit_list: any;
  constructor(
    private kanbanServ: KanbanService,
    private web3Serv: Web3Service,
    private starServ:StarService, 
    private router: Router, 
    private utilServ: UtilService) { }

  ngOnInit(): void {
    this.starServ.get7StarMerchantCredits().subscribe(
      async (ret: any) => {
        if(ret && ret.ok) {
          this.merchant_credit_list = ret._body;
          for(let i = 0; i < this.merchant_credit_list.length; i++) {
            this.merchant_credit_list[i]['realAmount'] = await this.getCredit(this.merchant_credit_list[i]);
          }
        }
      }
    );
  }

  getCoinName(coinType: number) {
    const coinName = this.utilServ.getCoinNameByTypeId(coinType);
    return coinName;
  }
  
  add() {
    this.router.navigate(['/admin/merchant-credit/add']);
  }

  async getCredit(item) {
    console.log('item===', item);
    if(!item.store) {
      return -1;
    }
    const feeChargerSmartContractAddress = item.store.feeChargerSmartContractAddress;
    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_merchant",
          "type": "address"
        },
        {
          "internalType": "uint32",
          "name": "_coinType",
          "type": "uint32"
        }
      ],
      "name": "getCredit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    };
    const args = [feeChargerSmartContractAddress, item.coinType];
    const abihex = this.web3Serv.getGeneralFunctionABI(abi, args);
    const ret = await this.kanbanServ.kanbanCallAsync(environment.addresses.smartContract.merchantCredit2, abihex);
    console.log('ret===', ret);
    const amount = new BigNumber(ret.data, 16).shiftedBy(-18).toNumber();
    console.log('amount=', amount);
    return amount;
    //const 
  }
}
