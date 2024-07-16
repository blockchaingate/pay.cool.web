import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { environment } from '../../../environments/environment';
import { KanbanService } from '../../services/kanban.service';
import { PasswordModalComponent } from '../modals/password-modal/password-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { KanbanSmartContractService } from '../../services/kanban.smartcontract.service';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../services/data.service';
import { ProgressModalComponent } from '../../shared/modals/progress/progress.component';

@Component({
  selector: 'app-wallet-star-rewards',
  providers: [],
  templateUrl: './star-rewards.component.html',
  styleUrls: ['./star-rewards.component.scss', '../../../table.scss']
})
export class StarRewardsComponent implements OnInit{
    @Input() rewards: any;
    wallet: any;
    reward: any;
    modalRef: BsModalRef;

    constructor(
      public kanbanServ: KanbanService,
      private dataServ: DataService,
      private kanbanSmartContractServ: KanbanSmartContractService,
      private modalService: BsModalService,   
      private toastr: ToastrService,   
      private utilServ: UtilService) {}
    ngOnInit() {
      this.dataServ.currentWallet.subscribe(
        (wallet: any) => {
          this.wallet = wallet;
        }
      ); 
    }

    showOrderId(orderId: string) {
      return orderId.substring(2, 26);
    } 

    showId(id: string) {
      return id.substring(0,3) + '...' + id.substring(id.length - 3);
    }

    showAmount(amount: any) {
      return this.utilServ.toNumber(this.utilServ.showAmount(amount, 18));
    }

    showReleaseTime(reward: any) {
      const releaseTime = reward.releaseTime;
      const thetime = new Date(releaseTime * 1000).toLocaleDateString("en-US");
      return thetime;
    }

    getTxidUrl(txid: string) {
      return environment.endpoints.website + 'explorer/tx-detail/' + txid; 
    }
    
    showStatus(status: number) {
      //0: refunded 1: valid   2:  request refund  3: redeemed
      if(status == 0) {
        return 'refunded';
      }
      if(status == 1) {
        return 'valid';
      }
      if(status == 2) {
        return 'request refund';
      }
      if(status == 3) {
        return 'redeemed';
      }
    }
    


    showDetail(reward: any) {
      this
      let detail ='';
      for(let i = 0; i < reward.amount.length;i++) {
        const rewardAmount = reward.amount[i];
        const rewardCoinType = reward.coinType[i];
        if(rewardAmount > 0) {
          detail += this.showAmount(rewardAmount) + this.utilServ.getCoinNameByTypeId(rewardCoinType);
        }
        if(i != reward.amount.length - 1) {
          detail += '   '
        }
      }
      return detail;
    }

    redeemable(reward) {
      const timestamp = Math.floor(Date.now() / 1000);

      if(reward.status == 1 && reward.releaseTime < timestamp) {
        return true;
      }
      return false;
    }

    redeemAll() {
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
        this.redeemAllDo(seed);
      }); 
    }

    async redeemAllDo(seed) {
      let abi;
      let args;
      const txids = [];
      const initialState = {
        txids
      };   
      this.modalRef = this.modalService.show(ProgressModalComponent, { initialState, class: 'modal-lg' });
      for(let i = 0; i < this.rewards.length; i++) {
        const reward = this.rewards[i];
        if(!this.redeemable(reward)) {
          continue;
        }
        const address = reward.address;
        if(address == environment.addresses.smartContract.locker2) {
          abi = {
            "constant": false,
            "inputs": [
              {
                "name": "_ID",
                "type": "bytes32"
              },
              {
                "name": "_user",
                "type": "address"
              }
            ],
            "name": "releaseLocker",
            "outputs": [
              
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
          };
          args = [reward.id, this.utilServ.fabToExgAddress(reward.user)];
        } else {
          abi = {
            "inputs": [
              {
                "internalType": "bytes32",
                "name": "_ID",
                "type": "bytes32"
              },
              {
                "internalType": "address",
                "name": "_lockerOwner",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "_lockPeriod",
                "type": "uint256"
              }
            ],
            "name": "releaseLocker",
            "outputs": [
              
            ],
            "stateMutability": "nonpayable",
            "type": "function"
          };
          args = [reward.id, this.utilServ.fabToExgAddress(reward.user), reward.lockPeriod];
        }
  
  
        const ret = await this.kanbanSmartContractServ.execSmartContract(seed, address, abi, args);
        if(ret && (ret.ok || ret.success) && ret._body) {
          txids.push(ret._body);
        }
      }
    }

    redeem(reward) {
      this.reward = reward;
      const initialState = {
        pwdHash: this.wallet.pwdHash,
        encryptedSeed: this.wallet.encryptedSeed
      };          
      
      this.modalRef = this.modalService.show(PasswordModalComponent, { initialState });
  
      this.modalRef.content.onClose.subscribe( async (seed: Buffer) => {
        this.redeemDo(seed);
      });      
    }

    async redeemDo(seed: Buffer) {
      let address = this.reward.address;
      let abi;
      let args;

      if(address == environment.addresses.smartContract.locker2) {
        abi = {
          "constant": false,
          "inputs": [
            {
              "name": "_ID",
              "type": "bytes32"
            },
            {
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "releaseLocker",
          "outputs": [
            
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        };
        args = [this.reward.id, this.utilServ.fabToExgAddress(this.reward.user)];
      } else {
        abi = {
          "inputs": [
            {
              "internalType": "bytes32",
              "name": "_ID",
              "type": "bytes32"
            },
            {
              "internalType": "address",
              "name": "_lockerOwner",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "_lockPeriod",
              "type": "uint256"
            }
          ],
          "name": "releaseLocker",
          "outputs": [
            
          ],
          "stateMutability": "nonpayable",
          "type": "function"
        };
        args = [this.reward.id, this.utilServ.fabToExgAddress(this.reward.user), this.reward.lockPeriod];
      }


      const ret = await this.kanbanSmartContractServ.execSmartContract(seed, address, abi, args);
      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
        this.reward.status = 3;
        this.toastr.success('The reward was redeemed.');
      } else {
        this.toastr.error('Failed to redeem');
      }
    }
}