import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { UserpayService } from 'src/app/services/userpay.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { PasswordModalComponent } from '../../../shared/modals/password-modal/password-modal.component';
import { environment } from '../../../../environments/environment';
import { UtilService } from 'src/app/services/util.service';
import BigNumber from 'bignumber.js';
import { KanbanSmartContractService } from 'src/app/services/kanban.smartcontract.service';

@Component({
  selector: 'app-all-reward-details',
  templateUrl: './all-reward-details.component.html',
  styleUrls: ['./all-reward-details.component.scss']
})
export class AllRewardDetailsComponent implements OnInit {
  wallet: any;
  rewards: any;
  modalRef: BsModalRef;
  constructor(
    private kanbanSmartContractServ: KanbanSmartContractService,
    private modalService:BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private utilServ: UtilService,
    private dataServ: DataService,
    private userpayServ: UserpayService) { }

  ngOnInit(): void {
    this.dataServ.currentWallet.subscribe(
      (wallet: any) => {
        this.wallet = wallet;
      }
    ); 

    this.userpayServ.getReissueSummary().subscribe(
      (ret: any) => {
        if(ret && ret.ok) {
          this.rewards = ret._body;
        }
      }
    );
  }

  sendRewards() {
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
      await this.sendDo(seed);
    });
  }

  async sendDo(seed: Buffer) {
    let success = true;
    for(let i = 0; i < this.rewards.length; i++) {
        const reward = this.rewards[i];
        const ret = await this.sendReward(seed, reward);
        if(ret == 0) {
          this.toastr.error('Sending rewards failed');
        } else {
          this.toastr.success('Sending rewards succeeded');
          this.rewards.splice(i, 1);
          i --;
        }
    }
  }

  async sendReward(seed, reward) {
    const abi = {
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
          },
          {
            "internalType": "uint32",
            "name": "_rewardCoin",
            "type": "uint32"
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

      let lockPeriod = Math.floor((reward.releaseTime - Math.floor(new Date().getTime() / 1000)) / 60 / 60 / 24) - 1;
      if(!environment.production) {
        lockPeriod = Math.abs(lockPeriod)
      }
      if(lockPeriod <= 0) {
          return 0;
      }
      const args = [
          reward.id, 
          this.utilServ.fabToExgAddress(reward.address), 
          lockPeriod,
          reward.rewardCoinType,
          '0x' + new BigNumber(reward.shouldGet).minus(reward.actualGet).shiftedBy(18).toString(16).split('.')[0]
      ];

      const ret = await this.kanbanSmartContractServ.execSmartContract(
          seed, 
          environment.addresses.smartContract.regularLocker2, 
          abi, args);
    
      if(ret && ret.ok && ret._body && ret._body.status == '0x1') {
        //this.toastr.success('Sending rewards succeeded');
        return 1;
      } else {
        return 0;
          //this.toastr.error('Sending rewards failed');
      }
  }

}
