import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CoinService } from 'src/app/services/coin.service';
import { StoreService } from 'src/app/services/store.service';
import BigNumber from 'bignumber.js/bignumber';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { DataService } from 'src/app/services/data.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-merchant-credit-add',
  templateUrl: './merchant-credit-add.component.html',
  styleUrls: ['./merchant-credit-add.component.scss']
})
export class MerchantCreditAddComponent implements OnInit {
  merchantId: string;
  modalRef: BsModalRef;
  coin: string;
  value: number;
  wallet: any;

  coins = ['DUSD', 'USDT', 'USDC', 'DCAD', 'DCNY', 'DJPY', 'DGBP', 
  'DEURO', 'DAUD', 'DMYR', 'DKRW', 'DPHP', 
  'DTHB', 'DTWD', 'DSGD', 'DHKD', 'DINR',
  'DMXN', 'DBRL', 'DNGN', 'BTC', 'ETH', 'FAB'];

  constructor(
    private kanbanSmartContractServ: KanbanSmartContractService,
    private coinServ: CoinService,
    private dataServ: DataService,
    private router: Router,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private storeServ: StoreService) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 
  }

  confirm() {
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
    if(!this.wallet || !this.wallet.pwdHash) {
      this.router.navigate(['/wallet']);
      return;
    }
    this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
      this.addCreditByOwnerDo(seed);
    });
  }
  
  async addCreditByOwnerDo(seed: Buffer) {
    const abi = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        },
        {
          "internalType": "uint32",
          "name": "_coinType",
          "type": "uint32"
        },
        {
          "internalType": "uint256",
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "addCreditByOwner",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    const args = [
      this.merchantId, 
      this.coinServ.getCoinTypeIdByName(this.coin), 
      '0x' + new BigNumber(this.value).shiftedBy(18).toString(16)
    ];

    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, environment.addresses.smartContract.smartConractMerchantInfo, abi, args);
    if(ret2 && ret2.ok && ret2._body && ret2._body.status == '0x1') {
      this.toastr.success('merchant credit was added successfully');
      this.router.navigate(['/admin/merchant-credit']);
    } else {
      this.toastr.error('Error while adding merchant credit');
    }
  }

}
