import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { PasswordModalComponent } from '../../shared/modals/password-modal/password-modal.component';
import { UtilService } from 'src/app/services/util.service';
import BigNumber from 'bignumber.js';
import { KanbanService } from 'src/app/services/kanban.service';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lockedlp',
  templateUrl: './lockedlp.component.html',
  styleUrls: ['./lockedlp.component.scss']
})
export class LockedlpComponent implements OnInit {
  modalRef: BsModalRef;
  wallet: any;
  receiverAddress: string;
  amount: number;
  balance: number;
  address: string;
  constructor(
    private toastr: ToastrService,
    private utilServ: UtilService,
    private kanbanServ: KanbanService,
    private kanbanSmartContractServ: KanbanSmartContractService,
    private translateServ: TranslateService,
    private modalServ: BsModalService,
    private localSt: LocalStorage,) { }

  ngOnInit(): void {

    this.localSt.getItem('ecomwallets').subscribe((wallets: any) => {

      if (!wallets || (wallets.length == 0)) {
        return;
      }
      this.wallet = wallets.items[wallets.currentIndex];
      this.loadWallet();
    });
  }

  loadWallet() {
    const addresses = this.wallet.addresses;
    const walletAddressItem = addresses.filter(item => item.name == 'FAB')[0];
    this.address = walletAddressItem.address;
    this.kanbanServ.getfetdusdLpBalance(this.address).subscribe((ret) => {

        this.balance = ret.balance;
    }); 
  }

  confirmTransfer() {
    if(this.amount > this.balance) {
      this.toastr.error(this.translateServ.instant('Not enough balance'));
      return;
    }
    const initialState = {
      pwdHash: this.wallet.pwdHash,
      encryptedSeed: this.wallet.encryptedSeed
    };          
      
    this.modalRef = this.modalServ.show(PasswordModalComponent, { initialState });

    this.modalRef.content.onClose.subscribe(async (seed: Buffer) => {
        const approve = await this.approvePairDo(seed);
        if(approve) {
          await this.transferDo(seed);
        }
        
    });
  }

  async approvePairDo(seed: Buffer) {
    const abi = {
      "constant": false,
      "inputs": [
              {
                "internalType": "address",
                "name": "spender",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
              }
            ],
            "name": "approve",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
    };
    const lpLockerAddress = this.kanbanServ.getLpLockerAddress();
    const args = [
      lpLockerAddress,
        '0x' + new BigNumber(this.amount).toString(16)
    ];
    const pairId = environment.production ? '0x958F8514F3B20bA2d16a9C6d8648F1596Cf8b113' : '0x847FFaefe8ce996cA9830F97d30126B646c2AA93';
    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, pairId, abi, args);
    if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
        return true;
    }
    this.toastr.error(this.translateServ.instant('Error while approving the pair'));
    return false;
  }
  async transferDo(seed: Buffer) {

    const abi = {
      "inputs": [
        {
          "internalType": "address",
          "name": "_user",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        }
      ],
      "name": "createLocker",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    const args = [
      this.utilServ.fabToExgAddress(this.receiverAddress),
      '0x' + new BigNumber(this.amount).toString(16)
    ];

    const lpLockerAddress = this.kanbanServ.getLpLockerAddress();
    const ret2 = await this.kanbanSmartContractServ.execSmartContract(seed, lpLockerAddress, abi, args);
    if(ret2 && ret2.success && ret2._body && ret2._body.status == '0x1') {
        const txid = ret2._body.transactionHash;
        this.kanbanServ.createPayRewardWithTxid(txid).subscribe(
          (ret : any) => {
            if(ret && (ret.length > 0)) {
              this.toastr.success(this.translateServ.instant('Transfer request is made successfully.'));
            }
            
          }
        );
        
    } else {
        this.toastr.error(this.translateServ.instant('Error while transfering your asset'));
    }
  }

}
